const { errorResponse, successResponse } = require("../../../utils/response.utils");
const { fetchLogsBasedOnFilters, storeLogData } = require("../helpers/logs.helpers");

const ingestLogs = async (req, res) => {
  try {
    const {
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      metadata,
    } = req.body;
    await storeLogData({
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      metadata,
    });
    return successResponse({
      res,
      data: {},
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const fetchLogs = async (req, res) => {
  try {
    const { roleId } = req;
    const {
      filters = {},
      enablePagination = false,
      pageNumber = 1,
      pageSize = 10,
    } = req.body;
    const logsData = await fetchLogsBasedOnFilters({
      roleId,
      filters,
      enablePagination,
      pageNumber,
      pageSize,
    });
    const { logs = [], paginationData = {} } = logsData;
    const data = {
      logs,
    };
    if (enablePagination) {
      data.paginationData = paginationData;
    }
    return successResponse({
      res,
      data,
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

module.exports = {
  ingestLogs,
  fetchLogs,
};