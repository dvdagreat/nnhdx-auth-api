import getApp from "../app";
import request from "supertest";
import database from "../database/index";
import mongoose from "mongoose";

const app = getApp({ database });

beforeAll((done) => {
    done();
});

afterAll((done) => {
    mongoose.connection.close();
    done();
});

describe("/v1 route tests", () => {
    describe("POST /login", () => {
        it("post empty data", async () => {
            const res = await request(app).post("/v1/login").set("Content-Type", "text/plain");

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Content-Type should be set to application/json");
        });

        it("posts data with wrong key", async () => {
            const body = { userData: { username: "divyesh1", password: "password@123" } };
            const res = await request(app).post("/v1/login").send(body);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("User data is not provided");
        });
    });
    describe("POST /verify", () => {
        it("checks if token is valid", async () => {
            const body = {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpdnllc2gxIiwidWlkIjoiNjIyNGIzOGU1YzNhOTdlN2I0ODljZjA3IiwiaWF0IjoxNjQ2NTkyNDU5fQ.TwGhPdT0lECa2FPM3Ej4jt92NPNV_ja4EbzJG8xG8c0",
            };
            const res = await request(app).post("/v1/verify").send(body).set("Content-Type", "application/json");

            expect(res.body.success).toBe("true");
            expect(res.body.message).toBe("This token is valid");
        });

        it("checks if token is invalid", async () => {
            const body = {
                token: "eJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpdnllc2gxIiwidWlkIjoiNjIyNGIzOGU1YzNhOTdlN2I0ODljZjA3IiwiaWF0IjoxNjQ2NTkyNDU5fQ.TwGhPdT0lECa2FPM3Ej4jt92NPNV_ja4EbzJG8xG8c0",
            };
            const res = await request(app).post("/v1/verify").send(body).set("Content-Type", "application/json");

            expect(res.body.success).toBe("false");
            expect(res.body.message).toBe("This token is invalid");
        });
    });
});
