import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  user: process.env.DB_USER || '3KJRebnr8LRAvc7.root',
  password: process.env.DB_PASSWORD || '20tJKULPxlCwC2YQ',
  database: process.env.DB_DATABASE || 'db_yayasan',
});
