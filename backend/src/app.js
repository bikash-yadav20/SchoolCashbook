const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, User } = require("./models");

const authRoutes = require("./routes/auth");
const feeRoutes = require("./routes/fees");
const expenseRoutes = require("./routes/expenses");
const dashboardRoutes = require("./routes/dashboard");
const cashController = require("./routes/cashController");
const summery = require("./routes/summery");
const priorityRoutes = require("./routes/priority");

const app = express();

app.set("trust proxy", true);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server requests
      if (
        origin.endsWith(".vercel.app") ||
        origin === "https://api.nishifymart.com" ||
        origin.startsWith("http://localhost:5173")
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ledger", cashController);
app.use("/api/summary", summery);
app.use("/api/priorities", priorityRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const start = async () => {
  try {
    await sequelize.authenticate();
    const port = process.env.PORT || 8080;
    app.listen(port, "::", () =>
      console.log(`Backend running on port ${port}`),
    );
  } catch (e) {
    console.error("Server failed to start", e);
    process.exit(1);
  }
};

start();
