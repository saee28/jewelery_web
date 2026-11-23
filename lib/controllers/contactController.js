const db=require('../db'),{bad}=require('../helpers/response');
exports.send=async(req,res)=>{const {name,email,subject,message}=req.body;if(!name||!email||!message)throw bad('Name, email and message required');await db.query('INSERT INTO messages(name,email,subject,message) VALUES($1,$2,$3,$4)',[name,email,subject||'',message]);res.status(201).json({ok:true});};
exports.list=async(req,res)=>res.json((await db.query('SELECT * FROM messages ORDER BY id DESC LIMIT 200')).rows);
exports.remove=async(req,res)=>{await db.query('DELETE FROM messages WHERE id=$1',[req.params.id]);res.json({ok:true});};
