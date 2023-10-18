const jwt = require("jsonwebtoken");

// Secret key from enviroment variables
module.exports.generateUserToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_TOKEN,
    { expiresIn: "10m" }
  );

  console.log(`Token : Bearer ${token}`);
  return token;
};
