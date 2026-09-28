const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        message: "RankUp API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`RankUp server running on port ${PORT}`);
});



