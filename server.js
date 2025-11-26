const client = require("prom-client");
const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const Counter = require("./models/Counter");

const app = express();
app.use(express.json());

// Serve UI from "client" folder
app.use(express.static("client"));

// ------------------------------------
// 🌐 CONNECT TO MONGODB ATLAS (skip during tests)
// ------------------------------------
if (process.env.NODE_ENV !== "test") {
    mongoose.connect(
        "mongodb+srv://vrehemanth4_db_user:KfXHVRpxCQCmv54X@cluster0.cpxvt7l.mongodb.net/?appName=Cluster0"
    )
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.log("❌ MongoDB Error: ", err));
} else {
    console.log("⚠️ TEST MODE: MongoDB connection skipped");
}

// ------------------------------------
// 📊 PROMETHEUS METRICS
// ------------------------------------
client.collectDefaultMetrics();

const totalRequests = new client.Counter({
    name: "student_app_total_requests",
    help: "Total number of requests to the student backend"
});

// Middleware to increment counter
app.use((req, res, next) => {
    totalRequests.inc();
    next();
});

// /metrics endpoint
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
});

// ------------------------------------
// CRUD ROUTES
// ------------------------------------

// GET all students
app.get("/students", async (req, res) => {
    const students = await Student.find().sort({ studentId: 1 });
    res.json(students);
});

// POST new student
app.post("/students", async (req, res) => {
    let counter = await Counter.findOne({ name: "student_counter" });

    if (!counter) {
        counter = await Counter.create({ name: "student_counter", value: 1 });
    } else {
        counter.value += 1;
        await counter.save();
    }

    const student = new Student({
        studentId: counter.value,
        name: req.body.name,
        age: req.body.age
    });

    await student.save();
    res.status(201).json(student);
});

// PUT update
app.put("/students/:studentId", async (req, res) => {
    const studentId = parseInt(req.params.studentId);

    const student = await Student.findOneAndUpdate(
        { studentId: studentId },
        req.body,
        { new: true }
    );

    if (!student) {
        return res.status(404).json({ msg: "Student not found" });
    }

    res.json(student);
});

// PATCH update
app.patch("/students/:studentId", async (req, res) => {
    const studentId = parseInt(req.params.studentId);

    const student = await Student.findOneAndUpdate(
        { studentId: studentId },
        req.body,
        { new: true }
    );

    if (!student) {
        return res.status(404).json({ msg: "Student not found" });
    }

    res.json(student);
});

// DELETE student
app.delete("/students/:studentId", async (req, res) => {
    const studentId = parseInt(req.params.studentId);

    const student = await Student.findOneAndDelete({ studentId: studentId });

    if (!student) {
        return res.status(404).json({ msg: "Student not found" });
    }

    res.json({ msg: "Deleted" });
});

// ------------------------------------
// ✔ START SERVER (skip during tests)
// ------------------------------------
if (process.env.NODE_ENV !== "test") {
    app.listen(3000, () =>
        console.log("🚀 Server running at http://localhost:3000")
    );
}

module.exports = app;
