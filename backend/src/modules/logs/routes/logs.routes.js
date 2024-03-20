const { fetchLogs, ingestLogs } = require("../controllers/logs.controller");

module.exports = (router) => {
  router.post('/logs', ingestLogs);
  router.post('/auth/logs/list', fetchLogs);
};