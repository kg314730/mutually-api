const router = require("express").Router();
const User = require("./../models/user");
const Feed = require("./../models/feed");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/posts", async (req, res) => {
  try {
    if (typeof req.query.company != "undefined") {
      const posts = await Feed.find({ company: req.query.company }).sort({$natural:-1});
      res.send(posts);
    } else {
      const posts = await Feed.find({}).sort({$natural:-1});
      res.send(posts);
    }
  } catch (e) {
    return res.status(400).send({
      message: e.message,
    });
  }
});
router.post("/posts/delete", async (req, res) => {
  if (req.claims._id == req.body.userID) {
    const result = await Feed.deleteOne({ _id: req.body.postID });
    res.status(200).send(result);
  } else {
    res.status(401).send({
      message: "Unauthorized",
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
