import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import createHttpError from "http-errors";
import cors from "cors";

//creates an express server; it is an object
const server = express();

//declaring the port (like 3000 for React)
// const port = 3001;
const port = process.env.PORT;

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If current origin is in the whitelist you can move on
      corsNext(null, true);
    } else {
      // If it is not --> error
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors(corsOpts));

// If you do not add this line here BEFORE the endpoints, all req.body will be UNDEFINED
server.use(express.json());

//all authors related endpoints will share the same /authors prefix in their urls
server.use("/authors", authorsRouter);

//server needs to run
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("server running on port: ", port);
});
