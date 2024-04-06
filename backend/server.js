const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const app = express();
const host = process.env.DB_HOST
const port = process.env.SERVER_PORT;

const playerRouter = require("./routers/playerRouter");

// Middleware
app.use(cors());
app.use(express.json());

// Routers
app.use("/api", playerRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});