const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    response.status(500).send({ error: "Something went wrong" });
  }
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const user = request.user;

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(500).send({ error: "Something went wrong" });
  }
});

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
  try {
    const { id } = request.params;
    const user = request.user;

    const blogToDelete = await Blog.findById(id);

    if (!blogToDelete) {
      return response.status(404).json({ error: "Blog not found" });
    }

    if (blogToDelete.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: "You are not authorized to delete this blog" });
    }

    const result = await Blog.findByIdAndDelete(id);
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    response.status(500).json({ error: "Something went wrong" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true }).populate("user", { username: 1, name: 1 });

    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).send({ error: "Blog not found" });
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    response.status(500).send({ error: "Something went wrong" });
  }
});

module.exports = blogsRouter;
