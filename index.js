import { createRequire } from 'module';
import typeDefs from './src/graphql/typeDefs.js';
import resolvers from './src/graphql/resolvers.js';

const require = createRequire(import.meta.url);
const { ApolloServer } = require('apollo-server');

const server = new ApolloServer({ typeDefs, resolvers, introspection: true, playground: true });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
