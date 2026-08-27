import bcrypt from 'bcrypt';
import { pool } from '../config/db';


/* --------- register user --------- */

const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password)
     VALUES($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, hashedPassword],
  );

  return result;
};

/* --------- login user --------- */

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return result;
  }

  const user = result.rows[0];

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return {
      rows: [],
      rowCount: 0,
    };
  }

  // Password response এ পাঠাবো না
  delete user.password;

  return {
    rows: [user],
    rowCount: 1,
  };
};

export const authServices = {
  registerUser,
  loginUser,
};
