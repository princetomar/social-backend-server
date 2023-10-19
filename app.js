require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/db");
const appTypeDefs = require("./graphql/typeDefs");
const resolver = require("./graphql/resolvers/index");
const { PubSub } = require("PubSub");

const port = process.env.PORT || 2000;

// connect to the database
connectDB();

// We are creating a asynchronus function to take the request req from express and forward it to apollo
async function startServer() {
  const app = express();
  app.use(express.json());
  const server = new ApolloServer({
    // Pass the configuration or resolvers
    typeDefs: appTypeDefs,
    resolvers: resolver,
    context: ({ req }) => ({ req, PubSub }),
    formatError: (error) => {
      console.log(error);
      return error;
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  // if any request comes to /graphql, then it get's handled by expressMiddleware
  app.use("/graphql", expressMiddleware(server));

  app.listen(port, () => console.log(`🚀 Server running on PORT ${port}`));
}

startServer();
