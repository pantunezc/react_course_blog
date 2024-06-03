const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];

const listWithMultipleBlogs = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f9",
    title: "Another Blog Post",
    author: "Another Author",
    url: "https://example.com",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17fa",
    title: "Yet Another Blog Post",
    author: "Yet Another Author",
    url: "https://example.com",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "Blog by Robert C. Martin",
    author: "Robert C. Martin",
    url: "https://example.com",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422ca71b54a676234d17fc",
    title: "Another Blog by Robert C. Martin",
    author: "Robert C. Martin",
    url: "https://example.com",
    likes: 0,
    __v: 0,
  },
];

const listWithNoBlogs = [];

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has multiple blogs, equals the sum of likes", () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    assert.strictEqual(result, 24); // 5 + 7 + 12 = 24
  });

  test("when list has no blogs, equals zero", () => {
    const result = listHelper.totalLikes(listWithNoBlogs);
    assert.strictEqual(result, 0);
  });
});

describe("favorite blog", () => {
  test("when list has only one blog, equals the likes of that blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list has multiple blogs, equals the blog with most likes", () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs);
    assert.deepStrictEqual(result, {
      title: "Yet Another Blog Post",
      author: "Yet Another Author",
      likes: 12,
    });
  });

  test("when list has no blogs, equals null", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });
});

describe("most blogs", () => {
  test("when list has only one blog, equals the author of that blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("when list has multiple blogs, equals the author with most blogs", () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 2,
    });
  });

  test("when list has no blogs, equals null", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });
});
