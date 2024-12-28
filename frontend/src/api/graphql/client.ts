import { ApolloClient, InMemoryCache } from "@apollo/client";

const uri = process.env.API_URL?`${process.env.API_URL}/graphql/` : "http://localhost:3001/graphql/";

const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache()
})

export default client;