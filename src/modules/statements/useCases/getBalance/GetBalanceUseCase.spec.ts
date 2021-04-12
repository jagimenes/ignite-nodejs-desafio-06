import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it("Should be able to get a balance from a existing user", async () => {
    const userMock = {
      name: "Jairo Gimenes",
      email: "jagimenes@gmail.com",
      password: "jairo-gimenes"
    }
    const user = await usersRepository.create(userMock);

    const balance = await getBalanceUseCase.execute({user_id: user.id || ""});

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });

  it("Should not be able to get a balance from a non existing user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: "1234"});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
