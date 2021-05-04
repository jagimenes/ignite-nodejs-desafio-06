import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const userMock1 = {
  name: "Test name",
  email: `mail_${Math.random()}@test.com`,
  password: "test"
}

const userMock2 = {
  name: "Test namee",
  email: `maill_${Math.random()}@test.com`,
  password: "testt"
}

describe("Create user controller", () => {

beforeAll( async () => {
  connection = await createConnection();
});

it("Should be able to create a user.", async () => {
  const response = await request(app).post("/api/v1/users").send(userMock1);

  expect(response.status).toBe(201);
});

it("Should not be able to create users with the same email.", async () => {
  const response1 = await request(app).post("/api/v1/users").send(userMock2);
  const response2 = await request(app).post("/api/v1/users").send(userMock2);

  expect(response1.status).toBe(201);
  expect(response2.status).toBe(400);
})

});
