const mongoose = require('mongoose');
const fs = require('fs');

const connectDB = async () => {
 const [mongou, mongop] = getDBCreds();
 const conn = await mongoose.connect(`mongodb://${mongou}:${mongop}@${process.env.MONGODBSERVERNAME}:${process.env.MONGODBSERVERPORT}/${process.env.STOCKSDB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin"
 });

 console.log(`MongoDB connected to ${conn.connection.host}`.cyan);
};

module.exports = connectDB

function getDBCreds() {
   let mongouser, mongopassword
   if (process.env.NODE_ENV === 'development') {
      mongouser = process.env.STOCKSMONGODBUSER
      mongopassword = process.env.STOCKSMONGODBPASS
   }
   else if(process.env.NODE_ENV === 'production') {
      mongouser = fs.readFileSync('/run/secrets/stocksmongouser', 'utf-8');
      mongopassword = fs.readFileSync('/run/secrets/stocksmongopassword', 'utf-8');
      mongouser=mongouser.trim();
      mongopassword=mongopassword.trim();
   }

   return [mongouser, encodeURIComponent(mongopassword)]
}