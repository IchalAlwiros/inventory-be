const express = require("express");

const cors = require("cors");
const app = express();
const corsOptions = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
app.options("", cors(corsOptions));
app.use(cors(corsOptions));
const dotenv = require("dotenv");

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors(corsOptions));
dotenv.config();

// ROUTE
require("./src/routes")(app);

// PORT
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", function () {
  // ...
  console.log(`Listen port`);
});
