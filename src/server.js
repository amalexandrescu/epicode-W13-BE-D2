import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";

//creates an express server; it is an object
const server = express();

//declaring the port (like 3000 for React)
const port = 3001;

// If you do not add this line here BEFORE the endpoints, all req.body will be UNDEFINED
server.use(express.json());

//all authors related endpoints will share the same /authors prefix in their urls
server.use("/authors", authorsRouter);

//server needs to run
server.listen(port, () => {
  console.table(listEndpoints(server));
});
