const elasticsearch = require('elasticsearch');

const elasticHost = process.env.ELASTIC_HOST;
const elasticPort = process.env.ELASTIC_PORT;

const endPoint = `http://${elasticHost}:${elasticPort}`;

const esClient = new elasticsearch.Client({
  host: endPoint,
});

esClient.ping(
  {
    requestTimeout: 30000,
  },
  (error) => {
    if (error) {
      console.error('elasticsearch cluster is down!');
    } else {
      console.info('elasticsearch is running');
    }
  },
);

module.exports = {
  esClient,
};
