const { signUpUser, loginUser } = require("../controllers/users.controller");

module.exports = (router) => {
  router.post('/signup', signUpUser);
  router.post('/login', loginUser);
};