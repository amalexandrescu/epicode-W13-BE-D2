import express from "express";
import fs from "fs"; //core module
import uniqid from "uniqid"; //3rd party module
import { fileURLToPath } from "url";
import { dirname, join } from "path";

//an express router for exporting all the endpoints with a single command
const authorsRouter = express.Router();

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

const fileContent = fs.readFileSync(authorsJSONPath);

// GET /authors => returns the list of authors: http://localhost:3001/authors
// GET /authors/123 => returns a single author: http://localhost:3001/authors/:authorId
// POST /authors => create a new author: http://localhost:3001/authors/ (+body)
// PUT /authors/123 => edit the author with the given id: http://localhost:3001/authors/:authorId (+body)
// DELETE /authors/123 => delete the author with the given id: http://localhost:3001/authors/:authorId

authorsRouter.get("/", (req, res) => {
  console.log("this is the simple get method");
  // res.send("get mehtod here");
  const fileContentAsABuffer = fs.readFileSync(authorsJSONPath);
  console.log("file content: ", fileContentAsABuffer);

  const authorsArray = JSON.parse(fileContentAsABuffer);
  console.log("file content: ", authorsArray);
  // 2. Send it back as a response
  res.send(authorsArray);
});

authorsRouter.get("/:authorId", (req, res) => {
  console.log("get single author");
  // res.send("get mehtod for single author");

  const authorId = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const author = authorsArray.find((author) => author.id === authorId);

  res.send(author);
});

authorsRouter.post("/", (req, res) => {
  // res.send("hello, post method here");
  console.log("post");
  console.log("request body", req.body);
  const newAuthor = {
    ...req.body,
    id: uniqid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  res.status(201).send({ id: newAuthor.id });
});

authorsRouter.put("/:authorId", (req, res) => {
  console.log("put");
  // res.send("put method here");
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldAuthor = authorsArray[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  authorsArray[index] = updatedAuthor;
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  res.send(updatedAuthor);
});

authorsRouter.delete("/:authorId", (req, res) => {
  console.log("delete");
  // res.send("delete method here");

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));
  res.send();
});

export default authorsRouter;

// {
//   "name": "John",
//   "surname": "Doe",
//   "email": "john.doe@gmail.com",
//   "birthDate": "04-04-1999",
//   "avatar": "https://ui-avatars.com/api/?name=John+Doe",
// }
