const { errorResponse, successResponse } = require("../../../utils/response.utils");
const { signupUserAndGenerateToken, loginUserAndGenerateToken } = require("../helpers/users.helpers");

const signUpUser = async (req, res) => {
  try {
    const { name, mobile, password, role } = req.body;
    const { jwtToken } = await signupUserAndGenerateToken({
      name,
      mobile,
      password,
      role,
    });
    return successResponse({
      res,
      data: { jwtToken },
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const { jwtToken } = await loginUserAndGenerateToken({
      mobile,
      password,
    });
    return successResponse({
      res,
      data: { jwtToken },
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

module.exports = {
  signUpUser,
  loginUser,
};