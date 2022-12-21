import express from "express";
import uniqid from "uniqid";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const blogPostsRouter = express.Router();

const blogPostJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);
const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostJSONpath));
const writeBlogposts = (blogPostsArray) =>
  fs.writeFileSync(blogPostJSONpath, JSON.stringify(blogPostsArray));

blogPostsRouter.post("/", (request, response) => {
  try {
    const newPost = { ...request.body, createdAt: new Date(), _id: uniqid() };
    const blogPostsArray = getBlogPosts();
    blogPostsArray.push(newPost);
    writeBlogposts(blogPostsArray);
    response.status(201).send({ _id: newPost._id });
  } catch (error) {
    console.log(error);
  }
});

blogPostsRouter.get("/", (request, response) => {
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
    console.log(error);
  }
});

blogPostsRouter.get("/:postId", (request, response) => {
    try {
        const blogPosts = getBlogPosts();
        const post = blogPosts.find(post => post._id === request.params.postId)
      response.send(post)
  } catch (error) {}
});

blogPostsRouter.put("/:postId", (request, response) => {
  try {
    const posts = getBlogPosts();
    const index = posts.findIndex((post) => post._id === request.params.postId);
    const oldPost = posts[index];
    const updatedPost = { ...oldPost, ...request.body, updatedAt: new Date() };
    posts[index] = updatedPost;
    writeBlogposts(posts);
    response.send(updatedPost);
  } catch (error) {
    console.log(error);
  }
});

blogPostsRouter.delete("/:postId", (request, response) => {
try {
    const blogPosts = getBlogPosts();
} catch (error) {
    console.log(error);
}
});

export default blogPostsRouter;
