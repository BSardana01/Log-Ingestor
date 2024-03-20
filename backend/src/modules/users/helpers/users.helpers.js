const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;
const saltRounds = 10;

const { UserModel, RoleModel } = require("../../../mongoUtils/models");
const { statusCodes, ERROR_MESSAGES } = require("../../../utils/response.utils");

const generateJwtToken = ({
  userId,
  name,
  mobile,
}) => {
  const jwtPayload = {
    userId,
    name,
    mobile,
  };
  const options = {
    expiresIn: 60 * 60 * 24,
  };
  const jwtToken = jwt.sign(jwtPayload, jwtSecret, options);
  return jwtToken;
};

const matchUserPassword = ({
  password,
  userPassword,
}) => {
  const passwordMatches = bcrypt.compareSync(password, userPassword);
  return passwordMatches;
};

const getRoleId = async ({
  role,
}) => {
  const roleData = await RoleModel.findOne({ name: role }, { _id: 1 }).lean();
  const roleId = roleData?._id;
  return roleId;
};

const signupUserAndGenerateToken = async ({
  name,
  mobile,
  password,
  role,
}) => {
  const mobileAlreadyExists = !!(await UserModel.countDocuments({ mobile }));
  if (mobileAlreadyExists) {
    throw {
      code: statusCodes.RESOURCE_ALREADY_EXISTS,
      message: ERROR_MESSAGES.MOBILE_ALREADY_EXISTS,
    };
  }
  const roleId = await getRoleId({
    role,
  });
  if (!roleId) {
    throw {
      code: statusCodes.VALIDATION_FAILED,
      message: ERROR_MESSAGES.ROLE_NOT_EXISTS,
    };
  }
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const userData = await UserModel.create({
    name,
    mobile,
    password: hashedPassword,
    roleId,
  });
  const jwtToken = generateJwtToken({
    userId: userData._id,
    name,
    mobile,
  });
  return { jwtToken };
};

const loginUserAndGenerateToken = async ({
  mobile,
  password,
}) => {
  const findClause = {
    mobile,
  };
  const projectClause = {
    password: 1,
    name: 1,
  };
  const userData = await UserModel.findOne(findClause, projectClause).lean();
  if (!userData) {
    throw {
      code: statusCodes.VALIDATION_FAILED,
      message: ERROR_MESSAGES.USER_NOT_EXISTS,
    };
  }
  const userPassword = userData?.password;
  const passwordMatches = matchUserPassword({
    password,
    userPassword,
  });
  if (!passwordMatches) {
    throw {
      code: statusCodes.UNAUTHORIZED,
      message: ERROR_MESSAGES.INCORRECT_PASSWORD,
    };
  }
  const jwtToken = generateJwtToken({
    userId: userData?._id,
    name: userData?.name,
    mobile,
  });
  return { jwtToken };
};

module.exports = {
  signupUserAndGenerateToken,
  loginUserAndGenerateToken,
};