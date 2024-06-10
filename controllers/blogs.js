const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    response.status(500).send({ error: "Something went wrong" });
  }
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  if (!title || !url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const user = await User.findById(decodedToken.id);

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
