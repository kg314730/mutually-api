const router = require("express").Router();
const User = require("./../models/user");
const Feed = require("./../models/feed");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/posts", async (req, res) => {
  try {
    if (typeof req.query.company != "undefined") {
      const posts = await Feed.find({ company: req.query.company }, { _id: 0 });
      res.send(posts);
    } else {
      const posts = await Feed.find({}, { _id: 0 });
      res.send(posts);
    }
  } catch (e) {
    return res.status(400).send({
      message: e.message,
    });
  }
});
router.post("/addpost", async (req, res) => {
  const post = new Feed({
    creator: req.body.creator,
    referral_type: req.body.referral_type,
    company: req.body.company,
    text: req.body.text,
    link: req.body.link,
    picture: req.body.picture,
    name: req.body.name,
  });
  try {
    await post.save();
    res.status(200).send({ success: true, message: "Post added successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
