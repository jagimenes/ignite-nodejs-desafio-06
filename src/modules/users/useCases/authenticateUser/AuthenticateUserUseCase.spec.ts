import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Auth Users", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });


  it("Should be able to authenticate a existent user", async () => {
    const userMock = {
      name: "Jairo Gimenes",
      email: "jagimenes@gmail.com",
      password: "jairo-gimenes"
    }

    const user = await usersRepository.create(userMock);

    const login = await authenticateUserUseCase.execute({
      email: userMock.email,
      password: userMock.password
    });

    expect(login.user.id).toBe(user.id);
    expect(login.user.name).toBe(user.name);
    expect(login.user.email).toBe(user.email);
    expect(login).toHaveProperty("token");
  });

  it("Should not be able to authenticate a non existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@test.com",
        password: "test-password"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
