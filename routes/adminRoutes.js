const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../data/db.json");

// Helper functions
function readDB() {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}
function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ----------------------- Pages -----------------------

// Dashboard page
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/dashboard.html"));
});

// Users page
router.get("/users", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/users.html"));
});

// Orders page
router.get("/orders", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/orders.html"));
});

// Tasks page
router.get("/tasks", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/tasks.html"));
});

// Reports page
router.get("/reports", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/reports.html"));
});

// ----------------------- API Routes -----------------------

// Get all users
router.get("/api/users", (req, res) => {
    const db = readDB();
    res.json(db.users);
});

// Get all orders
router.get("/api/orders", (req, res) => {
    const db = readDB();
    res.json(db.orders);
});

// Get all tasks
router.get("/api/tasks", (req, res) => {
    const db = readDB();
    res.json(db.tasks);
});

// ----------------------- POST Routes -----------------------

// Add User
router.post("/add-user", (req, res) => {
    const db = readDB();
    db.users.push({ id: Date.now(), name: req.body.name });
    writeDB(db);
    if (req.headers.accept.includes("application/json")) {
        res.json({ success: true });
    } else {
        res.redirect("/users");
    }
});

// Add Order
router.post("/add-order", (req, res) => {
    const db = readDB();
    db.orders.push({ id: Date.now(), item: req.body.item, amount: Number(req.body.amount) });
    writeDB(db);
    if (req.headers.accept.includes("application/json")) {
        res.json({ success: true });
    } else {
        res.redirect("/orders");
    }
});

// Add Task
router.post("/add-task", (req, res) => {
    const db = readDB();
    db.tasks.push({ id: Date.now(), task: req.body.task, status: "Pending" });
    writeDB(db);
    if (req.headers.accept.includes("application/json")) {
        res.json({ success: true });
    } else {
        res.redirect("/tasks");
    }
});

// ----------------------- DELETE & UPDATE Routes (for Reports) -----------------------

// Users
router.delete("/delete-user/:id", (req, res) => {
    const db = readDB();
    db.users = db.users.filter(u => u.id != req.params.id);
    writeDB(db);
    res.json({ success: true });
});

router.put("/update-user/:id", (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.id == req.params.id);
    if(user){
        if(req.body.name) user.name = req.body.name;
        writeDB(db);
        res.json({ success: true });
    } else res.status(404).json({ error: "User not found" });
});

// Orders
router.delete("/delete-order/:id", (req, res) => {
    const db = readDB();
    db.orders = db.orders.filter(o => o.id != req.params.id);
    writeDB(db);
    res.json({ success: true });
});

router.put("/update-order/:id", (req, res) => {
    const db = readDB();
    const order = db.orders.find(o => o.id == req.params.id);
    if(order){
        if(req.body.item) order.item = req.body.item;
        if(req.body.amount) order.amount = Number(req.body.amount);
        writeDB(db);
        res.json({ success: true });
    } else res.status(404).json({ error: "Order not found" });
});

// Tasks
router.delete("/delete-task/:id", (req, res) => {
    const db = readDB();
    db.tasks = db.tasks.filter(t => t.id != req.params.id);
    writeDB(db);
    res.json({ success: true });
});

router.put("/update-task/:id", (req, res) => {
    const db = readDB();
    const task = db.tasks.find(t => t.id == req.params.id);
    if(task){
        if(req.body.task) task.task = req.body.task;
        if(req.body.status) task.status = req.body.status;
        writeDB(db);
        res.json({ success: true });
    } else res.status(404).json({ error: "Task not found" });
});

module.exports = router;
