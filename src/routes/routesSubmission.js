const express = require("express");
const {
  createSubmission,
  listSubmission,
  viewSubmission,
  updateSubmission,
} = require("../controllers/submissionControllers");
const { authenticateToken } = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.post("/create", authenticateToken, createSubmission);

profileRouter.get("/list", authenticateToken, listSubmission);

profileRouter.get("/view/:id", authenticateToken, viewSubmission);

profileRouter.patch("/update", authenticateToken, updateSubmission);

module.exports = profileRouter;
