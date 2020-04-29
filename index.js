import { createRequire } from 'module';
import dataFetcher from './src/dataFetcher.js';
import dateFetcher from './src/dateFetcher.js';
import covidData from './data/dailyReports/json/04-26-2020.json';

const require = createRequire(import.meta.url);
const { ApolloServer, gql } = require('apollo-server');

dataFetcher(dateFetcher());

const typeDefs = gql`
  type Data {
    FIPS: String
    Admin2: String
    Province_State: String
    Country_Region: String
    Combined_Key: String
    Last_Update: String
    Lat: String
    Long_: String
    case: Case
  }

  type Case {
    Confirmed: String!
    Deaths: String!
    Recovered: String!
    Active: String!
  }

  type Query {
    getData: [Data]
    getCases: [Case]
    getCombinedKey(Combined_Key: String): Data
  }
`;

const resolvers = {
  Query: {
    getData() {
      return covidData;
    },
    getCases() {
      return covidData;
    },
    getCombinedKey(parent, args, context, info) {
      return covidData.find(data => data.Combined_Key === args.Combined_Key);
    },
  },
  Data: {
    case(parent) {
      return {
        Confirmed: parent.Confirmed,
        Deaths: parent.Deaths,
        Recovered: parent.Recovered,
        Active: parent.Active,
      };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
