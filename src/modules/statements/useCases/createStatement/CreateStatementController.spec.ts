import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const userMock = {
  name: "Test statement",
  email: `mail_statement_${Math.random()}@test.com`,
  password: "test"
}

describe("Statements controller", () => {

beforeAll( async () => {
  connection = await createConnection();
});

it("Should be able to deposit a value.", async () => {
  const responseCreateUser = await request(app).post("/api/v1/users").send(userMock);

  expect(responseCreateUser.status).toBe(201);

  const responseLogin = await request(app).post("/api/v1/sessions").send({
    email: userMock.email,
    password: userMock.password
  });

  expect(responseLogin.status).toBe(200);

  const { token } = responseLogin.body;

  const responseCreateStatement =
    await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 1,
      description: 'Found it !'
    })
    .set({
      Authorization: `Bearer ${token}`,
  });

  expect(responseCreateStatement.status).toBe(201);
});

it("Should be able to withdraw a value.", async () => {
  const responseLogin = await request(app).post("/api/v1/sessions").send({
    email: userMock.email,
    password: userMock.password
  });

  expect(responseLogin.status).toBe(200);

  const { token } = responseLogin.body;

  const responseCreateStatement =
    await request(app).post(`/api/v1/statements/withdraw`).send({
      amount: 1,
      description: 'Loose it !'
    })
    .set({
      Authorization: `Bearer ${token}`,
  });

  expect(responseCreateStatement.status).toBe(201);
});

});
