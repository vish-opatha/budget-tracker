import express from 'express';
import transaction from '../models/transaction.schema.js';
const router = express.Router();

router.post('/transaction', ({body}, res) => {
	transaction.create(body)
		.then(dbTransaction => {
			res.json(dbTransaction);
		})
		.catch(err => {
			res.status(404).json(err);
		});
});

router.post('/transaction/bulk', ({body}, res) => {
	transaction.insertMany(body)
		.then(dbTransaction => {
			res.json(dbTransaction);
		})
		.catch(err => {
			res.status(404).json(err);
		});
});

router.get('/transaction', (res) => {
	transaction.find({}).sort({date: -1})
		.then(dbTransaction => {
			res.json(dbTransaction);
		})
		.catch(err => {
			res.status(404).json(err);
		});
});

export default router;