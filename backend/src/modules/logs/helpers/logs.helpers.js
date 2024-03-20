const { esClient } = require("../../../elasticsearchUtils");
const { ROLES } = require("../../../mongoUtils/constants");
const { LogModel, RoleModel } = require("../../../mongoUtils/models");

const getLogAccessLevel = async ({
  message,
}) => {
  // some logic that determines access level (role) for a log
  const findClause = {
    name: ROLES.USER,
  };
  if (message && message.includes('DB')) {
    findClause.name = ROLES.ADMIN;
  }
  const roleData = await RoleModel.findOne(findClause, { _id: 1 }).lean();
  const roleId = roleData?._id;
  return roleId;
};

const storeLogData = async ({
  level,
  message,
  resourceId,
  timestamp,
  traceId,
  spanId,
  commit,
  metadata,
}) => {
  const roleId = await getLogAccessLevel({
    message,
  });
  await LogModel.create({
    level,
    message,
    resourceId,
    timestamp,
    traceId,
    spanId,
    commit,
    metadata,
    accessLevel: { roleId },
  });
  const query = {
    body: {
      query: {
        bool: {
          must: [
            
          ]
        }
      }
    },
    size: 100,
    index: 'logs'
  }
  const data = esClient.search(query)
  console.log('data', JSON.stringify(data))
};

const getLogsFindClause = ({
  roleId,
  filters,
}) => {
  const findClause = {
    'accessLevel.roleId': roleId,
  };
  const {
    level,
    message,
    resourceId,
    traceId,
    spanId,
    commit,
    parentResourceId,
    timestamp,
  } = filters;
  if (level) {
    findClause.level = level;
  }
  if (message) {
    findClause.$text = { $search: message.trim() };
  }
  if (resourceId) {
    findClause.resourceId = resourceId;
  }
  if (traceId) {
    findClause.traceId = traceId;
  }
  if (spanId) {
    findClause.spanId = spanId;
  }
  if (commit) {
    findClause.commit = commit;
  }
  if (parentResourceId) {
    findClause['metadata.parentResourceId'] = parentResourceId;
  }
  if (timestamp) {
    const startAt = timestamp?.startAt;
    const endAt = timestamp?.endAt;
    if (startAt) {
      findClause.createdAt = { $gte: new Date(startAt) };
    }
    if (endAt) {
      findClause.createdAt = { $lt: new Date(endAt) };
    }
  }
  return findClause;
};

const fetchLogsBasedOnFilters = async ({
  roleId,
  filters,
  enablePagination,
  pageNumber,
  pageSize,
}) => {
  const findClause = getLogsFindClause({
    roleId,
    filters,
  });
  const projectClause = {
    level: 1,
    message: 1,
    resourceId: 1,
    timestamp: 1,
    traceId: 1,
    spanId: 1,
    commit: 1,
    metadata: 1,
    _id: 0,
  };
  const logPromises = [];
  const findPromise = LogModel.find(findClause, projectClause);
  if (enablePagination) {
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    logPromises.push(
      findPromise
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    );
    logPromises.push(LogModel.countDocuments(findClause));
  } else {
    logPromises.push(
      findPromise
        .sort({ createdAt: -1 })
        .lean()
    );
  }
  const [
    logs,
    logCount
  ] = await Promise.all(logPromises);
  const logsData = {
    logs,
  };
  if (enablePagination) {
    const totalPages = Math.ceil(logCount / pageSize);
    const paginationData = {
      pageNumber,
      pageSize,
      totalCount: logCount,
      totalPages,
    };
    logsData.paginationData = paginationData;
  }
  return logsData;
};

module.exports = {
  storeLogData,
  fetchLogsBasedOnFilters,
};