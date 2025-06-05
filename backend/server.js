const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/User");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());



app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB error:", err));

app.get("/", (req, res) => {
  res.send("Hello, welcome to my home");
});

app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, title, profilePhoto, linkedIn, twitter } = req.body;

    if (!firstName || !lastName || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = new User({
      firstName,
      lastName,
      title,
      profilePhoto, 
      linkedIn,
      twitter
    });

    await user.save();
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => {
  console.log("Server is running on PORT 8000");
});
