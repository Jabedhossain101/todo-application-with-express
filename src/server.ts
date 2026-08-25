import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';
import { todosRoutes } from './modules/todos/todos.routes';
import { authRoutes } from './auth/auth.routes';

const app = express();
const port = config.port;

// ১. গ্লোবাল মিডলওয়্যার সবার উপরে
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ডেটাবেজ ইনিশিয়ালাইজ
initDB();

// রুট রাউট
app.get('/', logger, (req: Request, res: Response) => {
  res.send('hello i am a next level web developer');
});

// ২. মডুলার রাউট
app.use('/users', userRoutes);



// Todos Routes
app.use('/todos', todosRoutes);

//auth routes
app.use('/auth',authRoutes)


app.listen(port, '0.0.0.0', () => {
  console.log(`The server is running on http://localhost:${port}`);
});
