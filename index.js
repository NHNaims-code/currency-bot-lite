import express from "express";

const app = express();
const port = 9000;

let count = 0;


app.use("/", (req, res) => {
  setInterval(() => {
    count = count + 1;
  }, 1000)
  res.json({ message: "Hello From Express App", count: count });
});

app.listen(9000, () => {
  console.log(`Starting Server on Port ${port}`);
});
