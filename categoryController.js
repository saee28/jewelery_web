const db=require('../db'),{bad}=require('../helpers/response');
exports.list=async(req,res)=>res.json((await db.query('SELECT * FROM categories ORDER BY name')).rows);
exports.create=async(req,res)=>{if(!String(req.body.name||'').trim())throw bad('Category name required');const r=await db.query('INSERT INTO categories(name) VALUES($1) RETURNING *',[req.body.name.trim()]);res.status(201).json(r.rows[0]);};
exports.update=async(req,res)=>{const r=await db.query('UPDATE categories SET name=$1 WHERE id=$2 RETURNING *',[req.body.name,req.params.id]);if(!r.rowCount)throw bad('Category not found',404);res.json(r.rows[0]);};
exports.remove=async(req,res)=>{try{const r=await db.query('DELETE FROM categories WHERE id=$1 RETURNING id',[req.params.id]);if(!r.rowCount)throw bad('Category not found',404);res.json({ok:true});}catch(e){if(e.code==='23503')throw bad('Move or delete products in this category first');throw e;}};
