import { Request, Response } from "express";
import { container } from "tsyringe";
import CreateTransferUseCase from "./CreateTransferUseCase";

export default class CreateTransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { user_id } = request.params;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({
      sender_id,
      user_id,
      amount,
      description
    });

    return response.status(201).json(transfer);
  }
}
