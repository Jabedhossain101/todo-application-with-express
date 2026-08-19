import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(
  process.cwd(),".env"
)})

const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Users table created successfully');

    // Create todos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Todos table created successfully');

  } catch (error) {
    console.error('Database initialization failed:', error);
  }

//   await pool.query(`
//       CREATE TABLE IF NOT EXISTS todos(
//       id SERIAL PRIMARY KEY,
//       user_id INT REFERENCES users(id) ON DELETE CASCADE,
// title VARCHAR(200) NOT NULL,
// completed BOOLEAN DEFAULT false,
//  due_date DATE,
//  created_at TIMESTAMP DEFAULT NOW(),
//  updated_at TIMESTAMP DEFAULT NOW()
//       )
//       `);
};

initDB();

app.use(express.json());

// app.use(express.urlencoded());
// This is used for form data

app.get('/', (req: Request, res: Response) => {
  res.send('I am a next level developer');
});

app.post('/users', async(req: Request, res: Response) => {
  // console.log(req.body);
  const { name, email } = req.body;
  try {
    const result = await pool.query(`INSERT INTO users(name,email) VALUES($1, $2) RETURNING *`, [name, email])

 res.status(201).json({
   success: false,
   message: 'data inserted successfully',
   data: result.rows[0],
 });
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
  res.status(201).json({
    success: true,
    message: 'Your data is showing on the server',
  });
});

app.listen(port, () => {
  console.log(`The server is running on ${port}`);
});
