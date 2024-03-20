const restana = require('restana')();

const router = restana.newRouter();

require('./modules/users/routes/users.routes')(router);
require('./modules/logs/routes/logs.routes')(router);

module.exports = router;