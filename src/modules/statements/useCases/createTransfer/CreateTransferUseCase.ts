import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ReceiverNotFound, SenderNotFound, InsufficientFunds } from "./CreateTranferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}


@injectable()
export default class CreateTransferUseCase {
  constructor(@inject("StatementsRepository")
              private statementsRepository: IStatementsRepository,
              @inject("UsersRepository")
              private usersRepository: IUsersRepository) {}
  async execute({
    user_id,
    sender_id,
    amount,
    description,
  }: ICreateTransferDTO) {
    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new SenderNotFound();
    }

    const receiver = await this.usersRepository.findById(user_id);

    if (!receiver) {
      throw new ReceiverNotFound();
    }

    const balance = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
      with_statement: false
    });

    if (amount > balance.balance) {
      throw new InsufficientFunds();
    }

    const withdraw = await this.statementsRepository.create({
      user_id: sender_id,
      amount,
      description: `Transfer to ${receiver.name}: ${description}`,
      type: OperationType.WITHDRAW
    });

    const transfer = await this.statementsRepository.create({
      user_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER
    });


    return transfer;
  }
}
