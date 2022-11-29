const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS_WORD}@cluster0.dj2b9xh.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(uri, { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log(err);
  });
