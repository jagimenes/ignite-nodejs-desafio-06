import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const userMock = {
  name: "Test balance",
  email: `mail_balance_${Math.random()}@test.com`,
  password: "test"
}

describe("Show user balance controller", () => {

beforeAll( async () => {
  connection = await createConnection();
});

it("Should be able to show user's balance.", async () => {
  const responseCreateUser = await request(app).post("/api/v1/users").send(userMock);

  expect(responseCreateUser.status).toBe(201);

  const responseLogin = await request(app).post("/api/v1/sessions").send({
    email: userMock.email,
    password: userMock.password
  });

  expect(responseLogin.status).toBe(200);

  const { token } = responseLogin.body;

  const responseShowBalance =
    await request(app).get(`/api/v1/statements/balance`)
    .send()
    .set({
      Authorization: `Bearer ${token}`,
  });

  expect(responseShowBalance.status).toBe(200);
});

it("Should not be able to show a user's balance when user does not exist.", async () => {
  const responseShowProfile =
    await request(app).get(`/api/v1/statements/balance`)
    .send();

  expect(responseShowProfile.status).toBe(401);
});

});
