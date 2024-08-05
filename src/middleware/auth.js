const jwt = require("jsonwebtoken");
const { responseError } = require("../../utils/response");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  let decodedToken = jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    (err, decoded) => {
      if (err) return responseError(res, 403, "Unauthorized");

      return decoded;
    }
  );

  req.user = decodedToken;

  next();
};

module.exports = {
  authenticateToken,
};
