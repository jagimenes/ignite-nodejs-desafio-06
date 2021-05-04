import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const userMock = {
  name: "Test name",
  email: `mail_auth_${Math.random()}@test.com`,
  password: "test"
}

describe("Authenticate user controller", () => {

beforeAll( async () => {
  connection = await createConnection();
});

it("Should be able to authenticate a user.", async () => {
  const response = await request(app).post("/api/v1/users").send(userMock);

  expect(response.status).toBe(201);

  const responseLogin = await request(app).post("/api/v1/sessions").send({
    email: userMock.email,
    password: userMock.password
  });

  expect(responseLogin.status).toBe(200);
});

it("Should not be able to authenticate a non existent user.", async () => {
  const responseLogin = await request(app).post("/api/v1/sessions").send({
    email: "a",
    password: "a"
  });

  expect(responseLogin.status).toBe(401);
})

});
