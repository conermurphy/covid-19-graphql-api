import { createRequire } from 'module';
import typeDefs from './src/graphql/typeDefs.js';
import resolvers from './src/graphql/resolvers.js';

const require = createRequire(import.meta.url);
const { ApolloServer } = require('apollo-server');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
