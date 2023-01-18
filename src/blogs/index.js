import express from "express";
import uniqid from "uniqid";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import HttpError from "http-errors";

const { NotFound } = HttpError;

const blogPostsRouter = express.Router();

const blogPostJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);
const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostJSONpath));
const writeBlogposts = (blogPostsArray) =>
  fs.writeFileSync(blogPostJSONpath, JSON.stringify(blogPostsArray));

blogPostsRouter.post("/", (request, response, next) => {
  try {
    const newPost = { ...request.body, createdAt: new Date(), _id: uniqid() };
    const blogPostsArray = getBlogPosts();
    blogPostsArray.push(newPost);
    writeBlogposts(blogPostsArray);
    response.status(201).send({ _id: newPost._id });
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.get("/", (request, response, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    if (request.query && request.query.category) {
      const filterBlogPosts = blogPostsArray.filter(
        (post) => post.category === request.query.category
      );
      response.send(filterBlogPosts);
    } else {
      response.send(blogPostsArray);
    }
  } catch (error) {
    next(error)
  }
});

blogPostsRouter.get("/:postId", (request, response, next) => {
  try {
    const blogPosts = getBlogPosts();
    const post = blogPosts.find((post) => post._id === request.params.postId);
    if (post) {
      response.send(post);
    } else {
      next(NotFound(`blogPost id ${req.params.postId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.put("/:postId", (request, response, next) => {
  try {
    const posts = getBlogPosts();
    const index = posts.findIndex((post) => post._id === request.params.postId);
    const oldPost = posts[index];
    const updatedPost = { ...oldPost, ...request.body, updatedAt: new Date() };
    posts[index] = updatedPost;
    writeBlogposts(posts);
    if (updatedPost) {
      response.send(updatedPost);
    } else {
      next(NotFound(`Blogpost id ${req.params.postId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:postId", (request, response, next) => {
  try {
    const blogPost = getBlogPosts();
    const remainingposts = blogPost.filter(
      (post) => post._id !== request.params.postId
    );
    if (blogPost.length !== remainingposts.length) {
      writeBlogposts(remainingposts);
      response.status(204).send();
    } else {
      next(NotFound(`blogpost id ${request.params.postId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
