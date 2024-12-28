import { ApolloServer } from "apollo-server";
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import { connectDB } from "./config/db";
connectDB();

const server = new ApolloServer({typeDefs,resolvers,
     cors:{
          origin:"http://localhost:3000",
     }
});
const port = process.env.PORT || 8001;

server.listen(port).then(({url}) =>{
     console.log(`🚀 Server ready at ${url}`);
})