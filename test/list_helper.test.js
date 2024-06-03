const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
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
  ];

  const listWithNoBlogs = [];

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
