const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    response.status(500).send({ error: "Something went wrong" });
  }
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes,
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(500).send({ error: "Something went wrong" });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Blog.findByIdAndDelete(id);
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).send({ error: "Blog not found" });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    response.status(500).send({ error: "Something went wrong" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true });

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
