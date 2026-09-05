require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

require("./db/init"); // ensures tables exist on boot
const { startCropRescueJob } = require("./jobs/cropRescue");

const authRoutes = require("./routes/auth");
const listingsRoutes = require("./routes/listings");
const ordersRoutes = require("./routes/orders");
const aiRoutes = require("./routes/ai");
const rescueRoutes = require("./routes/rescue");
const paymentsRoutes = require("./routes/payments");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/rescue", rescueRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin", adminRoutes);

// ---------------------------------------------------------------------------
// Serve the built React frontend from this SAME server, so the whole app
// lives on ONE link (http://localhost:5000) instead of separate ports.
// Build it first with:  cd frontend && npm run build
// ---------------------------------------------------------------------------
const frontendDist = path.join(__dirname, "..", "frontend", "dist");

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // Any route that isn't /api/... sends back the React app (SPA routing)
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      status: "Uzhavan Connect API running",
      note: "Frontend build not found. Run 'npm run build' inside the frontend folder, then restart this server for the single-link setup.",
    });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Uzhavan Connect running on http://localhost:${PORT}`);
  startCropRescueJob();
});
