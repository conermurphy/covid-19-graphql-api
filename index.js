import { createRequire } from 'module';
import dailyData from './data/dailyReports/dailyReport.json';
import confirmedData from './data/timeSeriesReports/confirmed.json';
import deathData from './data/timeSeriesReports/deaths.json';
import recoveredData from './data/timeSeriesReports/recovered.json';

const require = createRequire(import.meta.url);
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type DailyData {
    FIPS: String
    Province_State: String
    Country_Region: String
    Combined_Key: String
    DailyCase: DailyCase
    Position: Position
    Admin: Admin
  }

  type TimeSeriesData {
    ProvinceState: String
    CountryRegion: String
    Lat: String
    Long: String
    Data: String
  }

  type Admin {
    Last_Update: String
    Admin2: String
  }

  type Position {
    Lat: String
    Long_: String
  }

  type DailyCase {
    Combined_Key: String
    Confirmed: String
    Deaths: String
    Recovered: String
    Active: String
  }

  type Query {
    getDailyData: [DailyData]
    getDailyCases: [DailyCase]
    getDailyCombinedKey(filter: String): [DailyData]
    getAllTimeSeries: [TimeSeriesData]
    getAllConfirmedDataTS: [TimeSeriesData]
  }
`;

const resolvers = {
  Query: {
    getDailyData() {
      return dailyData;
    },
    getDailyCases() {
      return dailyData;
    },
    getDailyCombinedKey(parent, args) {
      return dailyData.filter(data => data.Combined_Key.includes(args.filter));
    },
    getAllTimeSeries() {
      return confirmedData;
    },
    getAllConfirmedDataTS() {
      return allConfirmedData();
    },
  },
  DailyData: {
    DailyCase(parent) {
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

class allConfirmedData {
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
