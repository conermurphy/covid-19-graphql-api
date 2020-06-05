# COVID-19 GraphQL API
A GraphQL API to allow for the querying of data relating to the COVID-19 pandemic. Data is based off the [Johns Hopkins CSSE 2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository](https://github.com/CSSEGISandData/COVID-19).

## Technologies used:
- GraphQL
- NodeJS
- Apollo Server
- Netlify

## How to use:

The API is now live and can be used @ https://covid-19-graphql-api.herokuapp.com/

### Queries:

Currently you can query for the below:

- All Countries / Territories dead, recovered and confirmed case numbers. 
- Individual Country / Territory dead, recovered and confirmed case numbers.

Below is an example query for both:

**All:**

```
query {
  getTimeSeriesAll {
    uniqueId
    dead
    confirmed
    recovered
  }
}
```

**Individual:**

```
query {
  getTimeSeries(uniqueId: "United-Kingdom") {
    dead
    recovered
    confirmed
  }
}
```

To query for an individual country / territory you will need to find their uniqueId, which is made up of the territory and country name. For example:

```
"uniqueId": "Gibraltar-United-Kingdom"
"uniqueId": "United-Kingdom"
```

If you want to get a full list of uniqueId's you can run:

```
query {
  getTimeSeriesAll {
    uniqueId
  }
}
```

## Contributing

I am happy for people to contribute to the project, if you see a better way of doing something or just have an idea, raise a PR.
