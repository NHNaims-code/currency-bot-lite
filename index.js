import express from "express";

const app = express();
const port = 9000;

let count = 0;

setInterval(() => {
  count = count + 1;
  console.log(count)
}, 1000)

app.use("/", (req, res) => {
  res.json({ message: "Hello From Express App", count: count });
});

app.listen(9000, () => {
  console.log(`Starting Server on Port ${port}`);
});
