import express from "express";
import cors from "cors";
import { join } from "path"
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./blogs/index.js";
import filesRouter from "./blogs/files/index.js";
import mongoose from "mongoose";

const server = express();
const port = process.env.PORT;
 
const publicFolderPath = join(process.cwd(), "./public")

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} url ${req.url}`);
  next()
};

server.use(express.static(publicFolderPath))
server.use(cors());
server.use(loggerMiddleware)
server.use(express.json());
server.use("/blogPosts",loggerMiddleware, blogPostsRouter);
server.use("/files", loggerMiddleware, filesRouter);

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  console.log('Successfully connected to Mongo!');
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`server is running on port: ${port}`);
  });
})

