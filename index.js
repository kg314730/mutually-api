const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes");
const feedRoutes = require("./routes/feedroutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("./db/connection");

app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.url != "/login" && req.url != "/register") {
    try {
      const cookie = req.cookies["jwt"];
      const claims = jwt.verify(cookie, process.env.SECRET_KEY);
      if (!claims) {
        return res.status(401).send({
          message: "Unauthenticated",
        });
      }
      req.claims = claims;
    } catch (e) {
      return res.status(401).send({
        message: e.message,
      });
    }
  }
  next();
});

app.use("/", routes);
app.use("/feed", feedRoutes);

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
