import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const userMock = {
  name: "Test statement operation",
  email: `mail_get_operation_${Math.random()}@test.com`,
  password: "test"
}

describe("Get statement operations controller", () => {

beforeAll( async () => {
  connection = await createConnection();
});

it("Should be able to show a statement operation.", async () => {
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

  const { id } = responseCreateStatement.body;

  const responseShowStatement =
  await request(app).get(`/api/v1/statements/${id}`).send()
  .set({
    Authorization: `Bearer ${token}`,
  });

  expect(responseShowStatement.status).toBe(200);
});

it("Should not be able to show a non existent statement ID.", async () => {
  const responseLogin = await request(app).post("/api/v1/sessions").send({
    email: userMock.email,
    password: userMock.password
  });

  expect(responseLogin.status).toBe(200);

  const { token } = responseLogin.body;

  const responseShowStatement =
  await request(app).get(`/api/v1/statements/ee4be599-5257-42d9-ab9b-df0611bc0554`).send()
  .set({
    Authorization: `Bearer ${token}`,
  });

  expect(responseShowStatement.status).toBe(404);
});
});
