import { pool } from '../../config/db';
import bcrypt from 'bcryptjs';

/* create user */

const createUser = async (payload: Record<string, unknown>) => {
  
  const { name, email, password } = payload;

  const hashPass= await bcrypt.hash(password as string,10)
  const result = await pool.query(
    `INSERT INTO users(name, email,password) VALUES($1, $2, $3) RETURNING *`,
    [name, email,hashPass],
  );
  return result;
};

/* get all user */

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

/* get single user */

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

const putSingleUser = async (name:string, email:string,id:string) => {
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
    [name ,email,id],
  );
  return result;
};

const deleteSingleUser = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id],
  );
  return result;
}

export const userServices = {
  createUser,
  getUser,
  getSingleUser,
  putSingleUser,
  deleteSingleUser
};
