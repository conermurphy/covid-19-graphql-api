import { createRequire } from 'module';
// import dataFetcher from './src/dataFetcher.js';
import covidData from './data/dailyReports/dailyReport.json';

const require = createRequire(import.meta.url);
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Data {
    FIPS: String
    Province_State: String
    Country_Region: String
    Combined_Key: String
    Case: Case
    Position: Position
    Admin: Admin
  }

  type Admin {
    Last_Update: String
    Admin2: String
  }

  type Position {
    Lat: String
    Long_: String
  }

  type Case {
    Combined_Key: String
    Confirmed: String
    Deaths: String
    Recovered: String
    Active: String
  }

  type Query {
    getData: [Data]
    getCases: [Case]
    getCombinedKey(filter: String): [Data]
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
      return covidData.filter(data => data.Combined_Key.includes(args.filter));
    },
  },
  Data: {
    Case(parent) {
      return {
        Confirmed: parent.Confirmed,
        Deaths: parent.Deaths,
        Recovered: parent.Recovered,
        Active: parent.Active,
      };
    },
    Admin(parent) {
      return {
        Last_Update: parent.Last_Update,
        Admin2: parent.Admin2,
      };
    },
    Position(parent) {
      return {
        Lat: parent.Lat,
        Long_: parent.Long_,
      };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
