import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createstatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statements", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createstatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("Should be able to create a statement", async () => {
    const userMock = {
      name: "Jairo Gimenes",
      email: "jagimenes@gmail.com",
      password: "jairo-gimenes"
    }

    const user = await usersRepository.create(userMock);

    const statement = await createstatementUseCase.execute({
      user_id: user.id || "",
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "test"
    });

    expect(statement).toHaveProperty("id");
    expect(statement.user_id).toBe(user.id);
  });

  it("Should not be able to create a statement with no funds", async () => {
    expect(async () => {
      const userMock = {
        name: "Jairo Gimenes",
        email: "jagimenes@gmail.com",
        password: "jairo-gimenes"
      }

      const user = await usersRepository.create(userMock);

      await createstatementUseCase.execute({
        user_id: user.id || "",
        type: OperationType.WITHDRAW,
        amount: 1000000000,
        description: "test"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should not be able to create a statement with a non existent user", async () => {
    expect(async () => {

      await createstatementUseCase.execute({
        user_id: "1234",
        type: OperationType.DEPOSIT,
        amount: 1000000000,
        description: "test"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
