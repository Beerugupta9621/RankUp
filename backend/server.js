const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const communityRoutes = require("./routes/communityRoutes");

const setupArenaSocket = require("./socket/arenaSocket");

const app = express();

connectDB();


/* MIDDLEWARE */

app.use(cors());
app.use(express.json());
app.use(cookieParser());


/* HTTP SERVER */

const server = http.createServer(app);


/* SOCKET.IO SERVER */

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});


/* CODEARENA SOCKET */

setupArenaSocket(io);


/* TEST ROUTE */

app.get("/", (req, res) => {

    res.json({
        message: "RankUp API is running"
    });

});


/* API ROUTES */

app.use("/api/auth", authRoutes);

app.use("/api/problems", problemRoutes);

app.use("/api/submissions", submissionRoutes);

app.use("/api/community", communityRoutes);


/* START SERVER */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(
        `RankUp server running on port ${PORT}`
    );

    console.log(
        "CodeArena Socket.IO server is ready"
    );

});