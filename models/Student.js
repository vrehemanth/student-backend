const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentId: Number,
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Student", studentSchema);
