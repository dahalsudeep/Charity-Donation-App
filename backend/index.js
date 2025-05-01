const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let donations = [];

app.post("/donation", (req, res) => {
  donations.push(req.body);
  res.send({ status: "Donation logged" });
});

app.get("/donations", (req, res) => {
  res.send(donations);
});

app.listen(5000, () => console.log("Server running on port 5000"));
