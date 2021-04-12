import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("Should show a user profile", async () => {
    const userMock = {
      name: "Jairo Gimenes",
      email: "jagimenes@gmail.com",
      password: "jairo-gimenes"
    }

    const user = await usersRepository.create(userMock);
    const profile = await showUserProfileUseCase.execute(user.id || "");
  });

  it("Should show a error if user does not exist", async () => {
    expect(async() => {
      await showUserProfileUseCase.execute("12345");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
