import express from "express";
import StiveBlogsModel from "./model.js"; // mongodb collection model
import createHttpError from "http-errors";
import CommentsModel from "../comments/model.js";

const mongoBlogsRouter = express.Router();

mongoBlogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new StiveBlogsModel(req.body);
    const { _id } = await newBlogPost.save();
    res.status(201).send({ id: _id });
  } catch (error) {
    next(error);
  }
});
mongoBlogsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await StiveBlogsModel.find();
    res.status(200).send(blogPosts);
  } catch (error) {
    next(error);
  }
});
mongoBlogsRouter.get("/:postId", async (req, res, next) => {
  try {
    const blogPost = await StiveBlogsModel.findById(req.params.postId);
    if (blogPost) res.send(blogPost);
    else
      next(
        createHttpError(404, `User with id ${req.params.postId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});
mongoBlogsRouter.put("/:postId", async (req, res, next) => {
  try {
    const updatedPost = await StiveBlogsModel.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedPost) res.send(updatedPost);
    else
      next(
        createHttpError(404, `User with id ${req.params.postId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});
mongoBlogsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deletedPost = await StiveBlogsModel.findByIdAndDelete(
      req.params.postId
    );
    if (deletedPost) res.status(204).send();
    else
      next(
        createHttpError(404, `User with id ${req.params.postId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

// ******************************** EMBADDED COMMENTS ****************************
mongoBlogsRouter.post("/:postId", async (req, res, next) => {
  try {
    const updatedPost = await StiveBlogsModel.findByIdAndUpdate(
      req.params.postId,
      { $push: { comments: req.body } },
      { new: true, runValidators: true }
    );
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(
        createHttpError(404, `Blog post id ${req.params.postId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});




export default mongoBlogsRouter;
