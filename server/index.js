const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");

const { typeDefs } = require("./graphql/typeDefs");
const { resolvers } = require("./graphql/resolver");

const app = express();

// PORT
const port = 8000;

mongoose.set("strictQuery", false);

// mongodb connection
mongoose
  .connect(
    "mongodb+srv://Harshil0429:admin@cluster0.7oo9nxf.mongodb.net/employeeManagementSystem"
  )
  .then(() => {
    console.log("DB CONNECTED!");
  })
  .catch(() => {
    console.log("DB ERROR!");
  });

// create ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// start the apollo server
server.start().then(() => {
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: true,
  });
});

// starting backend server
app.listen(port, () => {
  console.log(`Server is running on ${port} port...`);
});
