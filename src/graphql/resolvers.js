import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const GraphQLJSON = require('graphql-type-json');
const dailyData = require('../../data/dailyReport.json');
const allTimeSeries = require('../../data/allTimeSeries.json');
const timeSeriesTotal = require('../../data/timeSeriesTotals.json');

export default {
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
    getTimeSeriesAll() {
      return allTimeSeries;
    },
    getTimeSeries(parent, args) {
      return allTimeSeries.filter(data => data.combinedKey === args.combinedKey);
    },
    getProvinceState(parent, args) {
      return allTimeSeries.filter(data => data.countryRegion.includes(args.countryRegion));
    },
    getUSSubStateLocations(parent, args) {
      return allTimeSeries.filter(data => data.countryRegion === 'US' && data.provinceState.includes(args.provinceState));
    },
    getTimeSeriesTotal() {
      return timeSeriesTotal;
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
  JSON: GraphQLJSON,
};
