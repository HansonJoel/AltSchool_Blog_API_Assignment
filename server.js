const express = require("express");
const database = require("./config/database");
const HOSTNAME = "localhost";
const PORT = process.env.PORT || 3000;
const auth = require("./middleware/auth");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");

const app = express();
database.connectDB();

app.use(auth); // apply auth middleware globally
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/v1/auth", authRoutes);
app.use("/v1/blogs", blogRoutes);

app.get("/", (req, res) => res.send("Welcome to my Blogging API"));

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});
