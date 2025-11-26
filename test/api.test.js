const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../server"); // your Express app

describe("Student API Tests", () => {

    let createdStudentId = null;

    // Test GET /students
    it("GET /students should return status 200", async () => {
        const res = await request(app).get("/students");
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
    });

    // Test POST /students
    it("POST /students should create a new student", async () => {
        const res = await request(app)
            .post("/students")
            .send({ name: "Test User", age: 20 });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("studentId");

        createdStudentId = res.body.studentId; // store for update/delete
    });

    // Test PATCH /students/:studentId
    it("PATCH /students/:id should update the student", async () => {
        const res = await request(app)
            .patch(`/students/${createdStudentId}`)
            .send({ name: "Updated User", age: 22 });

        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal("Updated User");
    });

    // Test DELETE /students/:studentId
    it("DELETE /students/:id should delete the student", async () => {
        const res = await request(app)
            .delete(`/students/${createdStudentId}`);

        expect(res.status).to.equal(200);
        expect(res.body.msg).to.equal("Deleted");
    });

});
