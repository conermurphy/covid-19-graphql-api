import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar JSON

  type DailyData {
    FIPS: String
    Province_State: String
    Country_Region: String
    Combined_Key: String
    DailyCase: DailyCase
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

  type DailyCase {
    Combined_Key: String
    Confirmed: String
    Deaths: String
    Recovered: String
    Active: String
  }

  type TimeSeriesData {
    combinedKey: String
    provinceState: String!
    countryRegion: String!
    recovered: JSON
    confirmed: JSON
    dead: JSON
  }

  type TimeSeriesTotal {
    confirmed: JSON
    recovered: JSON
    dead: JSON
  }

  type Query {
    getDailyData: [DailyData]
    getDailyCases: [DailyCase]
    getDailyCombinedKey(Combined_Key: String): [DailyData]
    getTimeSeriesAll: [TimeSeriesData]
    getTimeSeries(combinedKey: String): [TimeSeriesData]
    getProvinceState(countryRegion: String): [TimeSeriesData]
    getUSSubStateLocations(provinceState: String): [TimeSeriesData]
    getTimeSeriesTotal: TimeSeriesTotal
  }
`;

export default typeDefs;
