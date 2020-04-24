import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
// import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();
  return response.json({
    transactions,
    balance,
  });
  /**
   * @service is called from the router
   */
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const trasactionService = new CreateTransactionService();
  const transaction = await trasactionService.execute({
    title,
    value,
    type,
    category,
  });
  return response.json(transaction);
});

// transactionsRouter.delete('/:id', async (request, response) => {
//   // TODO
// });

// transactionsRouter.post('/import', async (request, response) => {
//   // TODOimport Transaction from '../models/Transaction';

// });

export default transactionsRouter;
