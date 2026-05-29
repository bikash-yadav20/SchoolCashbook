"use strict";

var express = require("express");

var cors = require("cors");

require("dotenv").config();

var _require = require("./models"),
    sequelize = _require.sequelize,
    User = _require.User;

var authRoutes = require("./routes/auth");

var feeRoutes = require("./routes/fees");

var expenseRoutes = require("./routes/expenses");

var dashboardRoutes = require("./routes/dashboard");

var cashController = require("./routes/cashController");

var summery = require("./routes/summery");

var priorityRoutes = require("./routes/priority");

var employee = require("./routes/employee");

var leaveRules = require("./routes/leaveRules");

var deductionRulesRoutes = require("./routes/deductionRulesRoutes");

var salaryLedgerRoute = require("./routes/salaryLedgerRoute");

var xlsxExport = require("./routes/xlsxExport");

var app = express();
app.set("trust proxy", true);
app.use(cors({
  origin: function origin(_origin, callback) {
    if (!_origin) return callback(null, true); // allow server-to-server requests

    if (_origin === "https://schoolcashbook-production.up.railway.app" || _origin === "https://www.kaizenacademy.online" || _origin === "https://kaizenacademy.online" || _origin === "https://api.kaizenacademy.online" || _origin.startsWith("http://localhost:5173")) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ledger", cashController);
app.use("/api/summary", summery);
app.use("/api/priorities", priorityRoutes);
app.use("/api/excel", xlsxExport);
app.use("/api/employee", employee);
app.use("/api/leave-rules", leaveRules);
app.use("/api/deduction-rules", deductionRulesRoutes);
app.use("/api/payroll", salaryLedgerRoute);
app.use("/api/excel", xlsxExport);
app.get("/health", function (req, res) {
  return res.json({
    status: "ok"
  });
});

var start = function start() {
  var port;
  return regeneratorRuntime.async(function start$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(sequelize.authenticate());

        case 3:
          console.log("DB connected");
          _context.next = 6;
          return regeneratorRuntime.awrap(sequelize.sync());

        case 6:
          port = process.env.PORT || 8080;
          app.listen(port, "::", function () {
            return console.log("Backend running on port ".concat(port));
          });
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error("Server failed to start", _context.t0);
          process.exit(1);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

start();