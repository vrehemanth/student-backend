const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");

const app = require("../server");

describe("Student API Tests", () => {

    let createdId;

    it("GET /students → should return array", async () => {
        const res = await request(app).get("/students");
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
    });

    it("POST /students → should create student", async () => {
        const res = await request(app)
            .post("/students")
            .send({ name: "Test", age: 20 });

        expect(res.status).to.equal(201);
        createdId = res.body.studentId;
    });

    it("PUT /students/:id → should update student", async () => {
        const res = await request(app)
            .put(`/students/${createdId}`)
            .send({ name: "Updated", age: 30 });

        expect(res.status).to.equal(200);
    });

    it("PATCH /students/:id → should partial update", async () => {
        const res = await request(app)
            .patch(`/students/${createdId}`)
            .send({ age: 35 });

        expect(res.status).to.equal(200);
    });

    it("DELETE /students/:id → should delete student", async () => {
        const res = await request(app)
            .delete(`/students/${createdId}`);

        expect(res.status).to.equal(200);
    });

});
