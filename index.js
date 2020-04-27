import { createRequire } from 'module';
import dataFetcher from './src/dataFetcher.js';
import dateFetcher from './src/dateFetcher.js';
import covidData from './data/json/04-26-2020.json';

const require = createRequire(import.meta.url);
const { ApolloServer, gql } = require('apollo-server');

// dataFetcher(dateFetcher());

const typeDefs = gql`
  type Key {
    FIPS: String
    Admin2: String
    Province_State: String
    Country_Region: String
    Last_Update: String
    Lat: String
    Long_: String
    Confirmed: String
    Deaths: String
    Recovered: String
    Active: String
    Combined_Key: String
  }

  type Query {
    data: [Key]
  }
`;

const resolvers = {
  Query: {
    data: () => covidData,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
