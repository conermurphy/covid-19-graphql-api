import { createRequire } from 'module';
import dailyData from '../../data/dailyReport.json';
import allTimeSeries from '../../data/allTimeSeries.json';

const require = createRequire(import.meta.url);
const { gql } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');

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
    getTimeSeries() {
      return allTimeSeries;
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
