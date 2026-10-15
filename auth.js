const jwt=require('jsonwebtoken');const {bad}=require('./helpers/response');
function token(user){if(!process.env.JWT_SECRET)throw bad('JWT_SECRET is not configured',500);return jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'7d'});}
function auth(req,res,next){try{const bearer=(req.headers.authorization||'').match(/^Bearer (.+)$/i);if(!bearer)throw bad('Please sign in',401);req.user=jwt.verify(bearer[1],process.env.JWT_SECRET);next();}catch(e){next(bad('Session expired. Please sign in again',401));}}
function admin(req,res,next){if(req.user?.role!=='admin')return next(bad('Administrator access required',403));next();}
module.exports={token,auth,admin};
