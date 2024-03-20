const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

dotenv.config();

const routes = require('./routes');
const { ERROR_MESSAGES, statusCodes, errorResponse } = require('./utils/response.utils');
const { connectMongo } = require('./mongoUtils');
const { authenticator } = require('./utils/authentication.utils');

const app = require('restana')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/auth', authenticator);
app.use('/', routes);

app.use((req, res, next) => errorResponse({
  res,
  code: statusCodes.ROUTE_NOT_FOUND,
  message: ERROR_MESSAGES.ROUTE_NOT_FOUND,
}));

const port = 3001;

try {
  (
    async function init () {
      await app.start(port);
      console.log(`Successfully started server on port ${port}`);
      await connectMongo();
      console.log('Successfully connected to db');
    }
  )();
} catch (error) {
  console.log('Failed in setting up the server');
  process.exit(0);
}