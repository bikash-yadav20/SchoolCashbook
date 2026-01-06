const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, User } = require("./models");

const authRoutes = require("./routes/auth");
const feeRoutes = require("./routes/fees");
const expenseRoutes = require("./routes/expenses");
const dashboardRoutes = require("./routes/dashboard");
const cashController = require("./routes/cashController");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ledger", cashController);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // For dev; replace with migrations in prod

    // Seed default admin (dev only)
    const bcrypt = require("bcryptjs");
    const adminUser = await User.findOne({ where: { username: "admin" } });
    if (!adminUser) {
      const hash = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "admin",
        password_hash: hash,
        role: "admin",
      });
      console.log("Seeded admin: admin/admin123");
    }

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Backend running on port ${port}`));
  } catch (e) {
    console.error("Server failed to start", e);
    process.exit(1);
  }
};

start();
