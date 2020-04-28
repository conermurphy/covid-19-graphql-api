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
    getData: [Data]
    getCombinedKey(Combined_Key: String): Data
  }
`;

const resolvers = {
  Query: {
    getData() {
      return covidData;
    },
    getCombinedKey(parent, args, context, info) {
      return covidData.find(data => data.Combined_Key === args.Combined_Key);
    },
  },
};

// getCaseData(parent, args, context, info) {
//   const caseData = {
//     confirmed: null,
//     deaths: null,
//     recovered: null,
//     active: null,
//   };
//   const index = covidData.findIndex(data => data.Combined_Key === args.Combined_Key);

//   caseData.confirmed = covidData[index].confirmed;
//   caseData.deaths = covidData[index].deaths;
//   caseData.recovered = covidData[index].recovered;
//   caseData.active = covidData[index].active;

//   return caseData;
// },

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
