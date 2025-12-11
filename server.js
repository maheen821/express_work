const express = require("express");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/", adminRoutes);

// Server
app.listen(3000, () => {
  console.log("Admin Dashboard running at http://localhost:3000");
});
