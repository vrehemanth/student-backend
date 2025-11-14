const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const Counter = require("./models/Counter");

const app = express();
app.use(express.json());

// Serve UI from "client" folder
app.use(express.static("client"));

// ------------------------------
// 🌐 CONNECT TO MONGODB ATLAS
// ------------------------------
mongoose.connect(
    "mongodb+srv://vrehemanth4_db_user:cgbNqmtB0Vt7wi2P@cluster0.uiivf00.mongodb.net/?appName=Cluster0"
)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.log("❌ MongoDB Error: ", err));


// ------------------------------
// CRUD ROUTES
// ------------------------------

// GET all students
app.get("/students", async (req, res) => {
    const students = await Student.find().sort({ studentId: 1 });
    res.json(students);
});

// POST new student
app.post("/students", async (req, res) => {
    let counter = await Counter.findOne({ name: "student_counter" });

    // If counter does not exist → create first entry
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
// PUT - full update using studentId
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
// UPDATE student
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

// DELETE student using studentId
app.delete("/students/:studentId", async (req, res) => {
    const studentId = parseInt(req.params.studentId);

    const student = await Student.findOneAndDelete({ studentId: studentId });

    if (!student) {
        return res.status(404).json({ msg: "Student not found" });
    }

    res.json({ msg: "Deleted" });
});
// ------------------------------
// START SERVER
// ------------------------------
app.listen(3000, () =>
    console.log("🚀 Server running at http://localhost:3000")
);
