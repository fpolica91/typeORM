// import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    const transactions = getRepository(Transaction);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw Error('transaction declined');
    }

    let transactionCategory = await categoryRepository.findOne({
      where: { name: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(transactionCategory);
    }

    const transaction = await transactions.create({
      title,
      type,
      value,
      category: transactionCategory,
    });
    await transactions.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
