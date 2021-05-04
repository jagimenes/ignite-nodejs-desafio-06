import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const userMock = {
  name: "Test name",
  email: `mail_profile${Math.random()}@test.com`,
  password: "test"
}

describe("Show user profile controller", () => {

beforeAll( async () => {
  connection = await createConnection();
});

it("Should be able to show a user profile.", async () => {
  const response1 = await request(app).post("/api/v1/users").send(userMock);

  expect(response1.status).toBe(201);

  const responseLogin = await request(app).post("/api/v1/sessions").send({
    email: userMock.email,
    password: userMock.password
  });

  expect(responseLogin.status).toBe(200);

  const { token } = responseLogin.body;

  const responseShowProfile =
    await request(app).get(`/api/v1/profile`)
    .send()
    .set({
      Authorization: `Bearer ${token}`,
  });

  expect(responseShowProfile.status).toBe(200);
});

it("Should not be able to show a user profile when user does not exist.", async () => {
  const responseShowProfile =
    await request(app).get(`/api/v1/profile`)
    .send();

  expect(responseShowProfile.status).toBe(401);
});

});
