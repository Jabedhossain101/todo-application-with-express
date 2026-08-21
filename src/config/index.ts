import dotenv from 'dotenv';

dotenv.config();

const config = {
  connection_str: process.env.CONNECTION_STR,
  port: Number(process.env.PORT) || 5000,
};

export default config;
