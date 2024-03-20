const http = require('http');

const statusCodes = {
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  ROUTE_NOT_FOUND: 404,
  RESOURCE_ALREADY_EXISTS: 409,
  VALIDATION_FAILED: 422,
  UNAUTHORIZED: 401,
};

const SUCCESS_MESSAGES = {
  SUCCESS: 'Success',
};

const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Something went wrong',
  ROUTE_NOT_FOUND: 'Route not found',
  MOBILE_ALREADY_EXISTS: 'Mobile already exists',
  ROLE_NOT_EXISTS: 'Role does not exist',
  USER_NOT_EXISTS: 'User does not exist',
  INCORRECT_PASSWORD: 'Incorrect password',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
};

const successResponse = ({
  res,
  code = statusCodes.SUCCESS,
  message = SUCCESS_MESSAGES.SUCCESS,
  data = {},
}) => {
  return res.send({
    code,
    message,
    data,
  },
  code,
  );
};

const errorResponse = ({
  res,
  code = statusCodes.INTERNAL_SERVER_ERROR,
  message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  data = {},
  error = null,
}) => {
  console.log('error in handler', error);
  code = error?.code || code;
  message = error?.message || message;
  if (!http.STATUS_CODES[code]) {
    code = statusCodes.INTERNAL_SERVER_ERROR;
  }
  return res.send({
    code,
    message,
    data,
  },
  code
  );
};

module.exports = {
  successResponse,
  errorResponse,
  statusCodes,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
};