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
  const blog = new Blog(request.body);

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(500).send({ error: "Something went wrong" });
  }
});

module.exports = blogsRouter;
