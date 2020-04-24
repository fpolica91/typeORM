import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
// import Transaction from '../models/Transaction';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);
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
const transactionService = new CreateTransactionService();

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  try {
    const transaction = await transactionService.execute({
      title,
      value,
      type,
      category,
    });
    return response.json(transaction);
  } catch (error) {
    return response.json({ error: error.message });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(id);
  return response.json({ success: 'transaction successfully deleted' });
});
transactionsRouter.post('/import', upload.single('file'), async (req, res) => {
  const transactionService = new ImportTransactionsService();
  const importedTransactions = await transactionService.execute(req.file.path);
  return res.json(importedTransactions);
});

export default transactionsRouter;
