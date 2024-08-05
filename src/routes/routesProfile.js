const express = require("express");
const { changeProfile } = require("../controllers/profileControllers");
const { authenticateToken } = require("../middleware/auth");

const profileRouter = express.Router();

// profileRouter.patch("/change", authenticateToken, changeProfile);

module.exports = profileRouter;
