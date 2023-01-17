import express from "express";
import multer from "multer";

const filesRouter = express.Router();


filesRouter.post("/single", multer().single("avatar"), async (req, res, next) => {
    try {
    console.log("FILE:", req.files)
    res.send(" file uploaded");
  } catch (error) {
    next(error);
  }
});

filesRouter.post("/multiple", multer().array("avatars"), async (req, res, next) => {
    try {
    console.log("FILES:", req.files)
      
    res.send("multiple files uploaded");
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
