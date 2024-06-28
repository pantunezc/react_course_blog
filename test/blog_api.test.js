// tests/blogs_api.test.js
const { test, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const assert = require("node:assert");
const bcrypt = require("bcrypt");
let authToken;

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({}); // Borra todos los usuarios antes de insertar nuevos

  const saltRounds = 10;
  const password = "password123";
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Inserta un usuario
  const user = new User({
    username: "user1",
    name: "User One",
    passwordHash: passwordHash, // Añade la contraseña o cualquier otro campo requerido
  });
  await user.save();

  // Crea los blogs con referencia al usuario creado
  const initialBlogs = [
    {
      title: "First Blog",
      author: "Author One",
      url: "http://example.com",
      likes: 1,
      user: user._id, // Asigna el ID del usuario creado
    },
    {
      title: "Second Blog",
      author: "Author Two",
      url: "http://example2.com",
      likes: 2,
      user: user._id, // Asigna el ID del usuario creado
    },
  ];

  await Blog.insertMany(initialBlogs);

  const credentials = {
    username: "user1",
    password: "password123",
  };

  const loginResponse = await api
    .post("/api/login")
    .send(credentials)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  authToken = loginResponse.body.token;
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, 2);
});

test("unique identifier property of blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;
  blogs.forEach((blog) => {
    assert.ok(blog.id);
    assert.strictEqual(blog._id, undefined);
  });
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "New Blog Post",
    author: "New Author",
    url: "http://example3.com",
    likes: 3,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${authToken}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, 3);

  const titles = blogsAtEnd.map((r) => r.title);
  assert.ok(titles.includes("New Blog Post"));
});

test("if likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Author",
    url: "http://example.com",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${authToken}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const savedBlog = response.body;
  assert.strictEqual(savedBlog.likes, 0);
});

test("blog without title and url is not added", async () => {
  const newBlog = {
    author: "Author without title and url",
    likes: 1,
  };

  await api.post("/api/blogs").send(newBlog).set("Authorization", `Bearer ${authToken}`).expect(400);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, 2);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await Blog.find({});
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).set("Authorization", `Bearer ${authToken}`).expect(204);

  const blogsAtEnd = await Blog.find({});
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

  const titles = blogsAtEnd.map((r) => r.title);
  assert.ok(!titles.includes(blogToDelete.title));
});

test("a blog can be updated", async () => {
  const blogsAtStart = await Blog.find({});
  const blogToUpdate = blogsAtStart[0];

  const updatedBlog = { ...blogToUpdate.toJSON(), likes: 10 };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await Blog.find({});
  const updatedBlogInDb = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
  assert.strictEqual(updatedBlogInDb.likes, 10);
});

test("updating a non-existing blog returns 404", async () => {
  const nonExistingId = "665dcb194be3f02f9042fe71";
  const updatedBlog = {
    title: "New Blog",
    author: "New Author",
    url: "http://newblog.com",
    likes: 5,
  };

  await api.put(`/api/blogs/${nonExistingId}`).send(updatedBlog).expect(404);
});

after(async () => {
  await mongoose.connection.close();
});
