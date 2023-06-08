import express from 'express';
import { connect } from 'mongoose';
import compression from 'compression';
import transactionRouter from './routers/transaction.router';

const app = express ();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

connect('mongodb://127.0.0.1:27017/workoutDb', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api', transactionRouter);

app.listen(3000, () =>{
	console.log('server is listening to 3000');
});

