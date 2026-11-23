const {Pool}=require('pg');
require('dotenv').config();
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL&&(/neon.tech|sslmode=require/.test(process.env.DATABASE_URL))?{rejectUnauthorized:false}:undefined,max:5,connectionTimeoutMillis:10000});
module.exports={pool,query:(sql,args=[])=>pool.query(sql,args)};
