module.exports = (app) => {
  const User = require("./routesAuth");
  app.use("/auth", User);

  const Profile = require("./routesProfile");
  app.use("/profile", Profile);

  const Submission = require("./routesSubmission");
  app.use("/submission", Submission);

  const Vercel = require("./routesVercel");
  app.use("/", Vercel);
};
