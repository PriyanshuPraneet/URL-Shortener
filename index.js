const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongodb } = require("./connection");
const URL = require("./models/url");

const app = express();
const PORT = 3000;

connectToMongodb("mongodb://localhost:27017/short-url").then(() =>
  console.log("db connected")
);

app.use(express.json());
app.use("/url", urlRoute);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timeStamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log("server started."));
