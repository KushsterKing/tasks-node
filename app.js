import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cors from 'cors';

// use it before all route definitions

import {userRouter, taskRouter} from './controller/index.js';
import mongoose from './database/index.js'
import authenticate from "./middlewares/auth.js";
const app = express();

app.use(cors({origin: 'http://localhost:3001'}));

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/tasks', authenticate, taskRouter);

app.listen(3000, () => {
    console.log('Server running on port 3000');
})