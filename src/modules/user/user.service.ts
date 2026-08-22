import { pool } from '../../config/db';

/* create user */

const createUser = async (name: string, email: string) => {
  const result = await pool.query(
    `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
    [name, email],
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
