import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperation: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperation = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("Should be able to get a statement operation", async () => {
    const userMock = {
      name: "Jairo Gimenes",
      email: "jagimenes@gmail.com",
      password: "jairo-gimenes"
    }

    const user = await usersRepository.create(userMock);

    const statementMock = {
      user_id: user.id || "",
      description: "Test",
      amount: 100,
      type: OperationType.DEPOSIT
    }

    const statement = await statementsRepository.create(statementMock);

    const statementOperation = await getStatementOperation.execute(
      {user_id: user.id || "", statement_id: statement.id || ""
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.amount).toBe(statementMock.amount);
    expect(statementOperation.id).toBe(statement.id);
  });

  it("Should not be able to get a statement operation with a non existing user", async () => {
    expect(async () => {
      await getStatementOperation.execute(
        {user_id: "1234", statement_id: "1234"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get a statement operation from a non existing statement", async () => {
    expect(async () => {
      const userMock = {
        name: "Jairo Gimenes",
        email: "jagimenes@gmail.com",
        password: "jairo-gimenes"
      }

      const user = await usersRepository.create(userMock);

      const statementOperation = await getStatementOperation.execute(
        {user_id: user.id || "", statement_id: "1234"
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
