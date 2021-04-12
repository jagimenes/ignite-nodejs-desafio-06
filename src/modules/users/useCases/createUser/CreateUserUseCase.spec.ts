import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { validate } from "uuid";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
});

  it("Should be able to create a user", async () => {
      const userMock = {
        name: "Jairo Gimenes",
        email: "jagimenes@gmail.com",
        password: "jairo-gimenes"
      }

      const user = await createUserUseCase.execute(userMock);
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("password");
      expect(validate(user.password)).toBeTruthy;
      expect(user.name).toBe(userMock.name);
      expect(user.email).toBe(userMock.email);
  });

  it("Should not be able to create two users with the same e-mail", async () => {
    expect(async () => {
    const userMock = {
      name: "Johnny Cage",
      email: "johnnycage@gmail.com",
      password: "Johnny-Cage"
    }

    await createUserUseCase.execute(userMock);
    await createUserUseCase.execute(userMock);
    }).rejects.toBeInstanceOf(CreateUserError);
});
});
