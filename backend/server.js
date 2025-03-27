const express = require("express");
const userRoutes = require("./routes/userRoutes");
const amcatRoutes = require("./routes/amcatRoutes");
const { notFound, errorHandle } = require("./middlewares/errorMiddleware");
const connectDB = require("./utils/db");
const cronJob = require("./utils/cronJob");
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
connectDB();
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/amcat", amcatRoutes);

app.use(notFound);
app.use(errorHandle);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
