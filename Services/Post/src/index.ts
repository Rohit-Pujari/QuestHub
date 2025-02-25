import { ApolloServer } from "@apollo/server";
import typeDefs from "./graphql/schema";
import { connectDB } from "./config/db";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./graphql/resolvers/index";
import { cacheClient } from "./config/cache";

// connect the database and Cache Servers before starting the service
connectDB();
cacheClient.connect();
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests

startStandaloneServer(server, {
  listen: { port: 8001 },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
