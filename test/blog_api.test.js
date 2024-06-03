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

after(async () => {
  await mongoose.connection.close();
});
