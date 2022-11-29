const mongoose = require('mongoose');
console.log(process.env.DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true},{useUnifiedTopology:true})
.then(()=>{
    console.log("Connection established")
})
.catch((err)=>{
    console.log(err);
})