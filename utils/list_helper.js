const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current), blogs[0]);
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCounts = _.countBy(blogs, "author");
  const author = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author]);

  return {
    author: author,
    blogs: authorCounts[author],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = _.groupBy(blogs, "author");
  const authorWithMostLikes = _.maxBy(_.keys(likesByAuthor), (author) => totalLikes(likesByAuthor[author]));

  return {
    author: authorWithMostLikes,
    likes: totalLikes(likesByAuthor[authorWithMostLikes]),
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
