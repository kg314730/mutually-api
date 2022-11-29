const router = require("express").Router();
const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", (_, res) => {
  res.send("Hello");
});
router.post("/register", async (req, res) => {
  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const data = await user.save();
    const { password, ...result } = data.toJSON();
    res.status(200).send(result);
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      res.status(422).send({ success: false, message: "User already exist!" });
    } else {
      res.status(422).send(err);
    }
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }
  if (!(await bcryptjs.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: "Invalid Credentials",
    });
  }
  const token = jwt.sign({ _id: user.id }, process.env.SECRET_KEY);
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 4 * 24 * 60 * 60 * 1000, //4 day\
  });
  res.status(200).send({
    message: "success",
  });
});

router.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, process.env.SECRET_KEY);
    console.log(cookie, claims);
    if (!claims) {
      return res.status(401).send({
        message: "Unauthenticated",
      });
    }
    const user = await User.findOne({ _id: claims._id });
    const { password, ...data } = user.toJSON();
    res.send(data);
  } catch (e) {
    return res.status(401).send({
      message: e.message,
    });
  }
});

router.post("/set", async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.body._id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    res.status(200).send({
      message: "success",
    });
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });
  res.send({
    message: "success",
  });
});

router.get("/search", async (req, res) => {
  try {
    const users = await User.find({
      current_company: req.query.company.toUpperCase(),
    });
    if (users.length == 0) {
      throw new Error(`No results found for ${req.query.company}`);
    }
    const results = users.map((user) => {
      const {
        _id,
        name,
        email,
        current_company,
        current_experience,
        current_position,
        profile_picture,
        ...rest
      } = user.toJSON();
      return {
        _id,
        name,
        email,
        current_company,
        current_experience,
        current_position,
        profile_picture,
      };
    });
    res.status(200).send(results);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/find", async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.query.id });
    const { password, messages, ...result } = users.toJSON();
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/messages", async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.query.id });
    const { messages, ...rest } = users.toJSON();
    res.status(200).send(messages);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/message", async (req, res) => {
  try {
    if (req.body.to == req.body.from) {
      res.status(400).send("Cannot send message to yourself");
    } else {
      const msg = {
        to: req.body.to,
        from: req.body.from,
        message: req.body.message,
      };
      await User.updateOne(
        { _id: req.body.to },
        {
          $push: {
            messages: {
              ...msg,
            },
          },
        }
      );
      await User.updateOne(
        { _id: req.body.from },
        {
          $push: {
            messages: {
              ...msg,
            },
          },
        }
      );
      res.status(200).send("Success");
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/referral", async (req, res) => {
  try {
    if (req.body.to == req.body.from) {
      res.status(400).send("Cannot refer yourself");
    } else {
      const ref = {
        to: req.body.to,
        from: req.body.from,
        date: req.body.date,
        company: req.body.company,
        position: req.body.position,
      };
      await User.updateOne(
        { _id: req.body.to },
        {
          $push: {
            referral_history: {
              ...ref,
            },
          },
        }
      );
      res.status(200).send("Success");
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = router;
