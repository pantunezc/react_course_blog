// tests/blogs_api.test.js
const { test, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const assert = require("node:assert");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const initialBlogs = [
    {
      title: "First Blog",
      author: "Author One",
      url: "http://example.com",
      likes: 1,
    },
    {
      title: "Second Blog",
      author: "Author Two",
      url: "http://example2.com",
      likes: 2,
    },
  ];

  await Blog.insertMany(initialBlogs);
});

test.only("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, 2);
});

test.only("unique identifier property of blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;
  blogs.forEach((blog) => {
    assert.ok(blog.id);
    assert.strictEqual(blog._id, undefined);
  });
});

test.only("a valid blog can be added", async () => {
  const newBlog = {
    title: "New Blog Post",
    author: "New Author",
    url: "http://example3.com",
    likes: 3,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, 3);

  const titles = blogsAtEnd.map((r) => r.title);
  assert.ok(titles.includes("New Blog Post"));
});

test.only("if likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Author",
    url: "http://example.com",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const savedBlog = response.body;
  assert.strictEqual(savedBlog.likes, 0);
});

test.only("blog without title and url is not added", async () => {
  const newBlog = {
    author: "Author without title and url",
    likes: 1,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, 2);
});

after(async () => {
  await mongoose.connection.close();
});
