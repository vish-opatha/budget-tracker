import express from 'express';
import transaction from '../models/transaction.schema.js';
const router = express.Router();

router.post('/transaction', (req, res) => {
	transaction.create(req.body)
		.then(dbTransaction => {
			res.json(dbTransaction);
		})
		.catch(err => {
			res.status(404).json(err);
		});
});

router.post('/transaction/bulk', (req, res) => {
	transaction.insertMany(req.body)
		.then(dbTransaction => {
			res.json(dbTransaction);
		})
		.catch(err => {
			res.status(404).json(err);
		});
});

router.get('/transaction', (req, res) => {
	transaction.find({}).sort({date: -1})
		.then(dbTransaction => {
			res.json(dbTransaction);
		})
		.catch(err => {
			res.status(404).json(err);
		});
});

export default router;