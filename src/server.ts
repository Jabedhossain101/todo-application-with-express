import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.routes';

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
app.post('/todos', async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title],
    );
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get('/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    res.status(200).json({
      success: true,
      message: 'Todos fetched successfully',
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`The server is running on http://localhost:${port}`);
});
