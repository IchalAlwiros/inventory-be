const jwt = require("jsonwebtoken");

const getUser = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(`ini dari get user ${token}`);

  if (token == null) return res.sendStatus(401);

  const tokenPayLoad = jwt.verify(token, process.env.TOKEN_SECRET);

  return tokenPayLoad;
};

module.exports = {
  getUser,
};
