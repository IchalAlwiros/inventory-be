const express = require("express");
const {
  register,
  login,
  changepassword,
  listUser,
} = require("../controllers/authControllers");
const { authenticateToken } = require("../middleware/auth");

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.get("/users", listUser);

authRouter.post("/change-password", authenticateToken, changepassword);

module.exports = authRouter;
