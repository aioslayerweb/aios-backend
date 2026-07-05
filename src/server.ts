import express from "express";
import intelligenceRouter from "./routes/intelligence";

const app = express();
app.use(express.json());
app.use("/intelligence", intelligenceRouter);

const port = Number(process.env.PORT || 3001);

app.listen(port, () => {
  console.log(`AIOS intelligence server listening on port ${port}`);
});
