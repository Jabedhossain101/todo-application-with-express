import express, { NextFunction, Request, response, Response } from 'express';
import { Pool } from 'pg';
import { request } from 'http';
import config from './config';
import initDB, { pool } from './config/db';


const app = express();
const port = config.port;


initDB();

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toString()}], ${req.method} ${req.path}\n`);
  next();
}

app.get('/', (req: Request, res: Response) => {
  res.send('hello i am a next level web developer')
})

app.use(express.json());

// app.use(express.urlencoded());
// This is used for form data

app.get('/', (req: Request, res: Response) => {
  res.send('I am a next level developer');
});


// CRUD operation for users table (POST METHOD)
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

});

//get all users using CRUD operation
app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(201).json({
      success: true,
      message: 'data currently shows from the database',
      data: result.rows
    })
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err
    })
  }
})


//get a single user using CRUD operation
app.get('/users/:id', async (req: Request, res: Response) => {
  // console.log(req.params.id);
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id= $1`, [
      req.params.id
    ])
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'data not found'
      }
      
      )
    } else {
      res.status(202).json({
        success: true,
        message: ' user data found',
        data: result.rows[0]
      })
  }
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
  
})

//update a single user using CRUD operation
app.put('/users/:id', async (req: Request, res: Response) => {
  // console.log(req.params.id);
  const { name, email } = req.body;
  try {
    const result = await pool.query(`UPDATE users SET name=$1 , email=$2 WHERE id=$3 RETURNING *`, [
      name,email,req.params.id
    ])
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'data not found'
      }
      
      )
    } else {
      res.status(202).json({
        success: true,
        message: ' user data updated ',
        data: result.rows[0]
      })
  }
  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
  
})

app.delete('/users/:id', async (req: Request, res: Response) => {
  // console.log(req.params.id);
  try {
    const result = await pool.query(`DELETE FROM users WHERE id= $1`, [
      req.params.id,
    ]);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: 'user not found',
      });
    } else {
      res.status(202).json({
        success: true,
        message: ' user data found',
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


app.post('/todos', async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  
  try {
    const result = await pool.query(`INSERT INTO todos(user_id,title) values($1,$2) RETURNING *`,[user_id,title])
    res.status(200).json({
      success: true,
      message: 'todos data is created',
      data: result.rows[0]
    })
    
  } catch (err:any) {
    res.status(500).json(
      {
        success: false,
        message: err.message
      }
    )
  }
})
app.get('/todos', async (req: Request, res: Response) => {
  
  try {
    const result = await pool.query(`SELECT * FROM todos`)
    res.status(200).json({
      success: true,
      message: 'todos data is created',
      data: result.rows[0]
    })
    
  } catch (err:any) {
    res.status(500).json(
      {
        success: false,
        message: err.message
      }
    )
  }
})

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: ' router not found',
    path: req.path
  })
})

app.listen(port, () => {
  console.log(`The server is running on ${port}`);
});
