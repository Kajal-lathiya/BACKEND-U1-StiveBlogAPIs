import express from "express";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./blogs/index.js";

const server = express();
const port = 3001;

server.use(express.json());
server.use("/blogPosts", blogPostsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`server is running on port: ${port}`);
});
