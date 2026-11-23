module.exports={wrap:(fn)=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next),bad:(message,status=400)=>Object.assign(new Error(message),{status})};
