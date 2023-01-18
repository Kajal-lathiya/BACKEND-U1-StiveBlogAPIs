import express from "express";
import q2m from "query-to-mongo";
import CommentsModel from "./model.js";

const commentsRouter = express.Router();

commentsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.body);
      console.log("mongoQuery:", mongoQuery);
      console.log("mongoQuery:", mongoQuery.criteria, mongoQuery.options);
    res.send("get all comments for the specific blog post");
  } catch (error) {
    next(error);
  }
});

export default commentsRouter;
