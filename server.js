const express = require("express");
const cors = require("cors");
const fetch = require("isomorphic-unfetch");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.REACT_APP_API_KEY
const API_URL = "https://api.openai.com/v1/chat/completions";

app.post("/chatgpt-clone-react", async (req, res) => {
  const options = {
    method:  "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model : "gpt-3.5-turbo",
      messages: [{role: "user", content: req.body.message}],
      max_tokens: 100,
    })
  }
  try {
    const response = await fetch(API_URL, options)
    const data = await response.json()
    res.send(data)
  } catch (error) {
    console.error(error)
    res.status(500).send("An error occurred");
  }
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));