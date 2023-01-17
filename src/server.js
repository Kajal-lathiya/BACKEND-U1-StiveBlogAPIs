import express from "express";
import cors from "cors";
import { join } from "path";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./blogs/index.js";
import filesRouter from "./blogs/files/index.js";

// mongo collection
import mongoose from "mongoose";
import mongoBlogsRouter from "./blogs/mongoBlogs/index.js";
import createHttpError from "http-errors";

const server = express();
const port = process.env.PORT;

const publicFolderPath = join(process.cwd(), "./public");

//**************************** MIDDLEWARE *********************************** */
const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} url ${req.url}`);
  next();
};

server.use(express.static(publicFolderPath));

const whitelist = [process.env.FE_DEV_URL, process.env.FE_DEV_URL];
const corsOptions = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      createHttpError(400, `Origin ${origin} is not in whitelist`);
    }
  }
};
server.use(cors(corsOptions));

server.use(loggerMiddleware);
server.use(express.json());

//**************************** ENDPOINTS *********************************** */

server.use("/blogPosts", loggerMiddleware, blogPostsRouter);
server.use("/files", loggerMiddleware, filesRouter);
server.use("/mongoBlogPosts", mongoBlogsRouter);

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`server is running on port: ${port}`);
  });
});
