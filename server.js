const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./utils/db');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//Routes
const stocks = require('./routes/stocks');
const keys = require('./routes/keys');
const auth = require('./routes/auth');

//Load env file
dotenv.config({path: './env/dev.env'});
const PORT = process.env.PORT || 5000;

//Connect to DB
connectDB();

//Initialize the application
const app = express();

//Use body parser middleware for http json data
app.use(express.json());

app.use(cookieParser());

//Load the logging module if in dev
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(mongoSanitize());
// Enable CORS - to receive requests from different domains
app.use(cors({credentials: true, origin: true}));

//Mount router to a base url
app.use('/api/v1/stocks', stocks);
app.use('/api/v1/keys', keys);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

//Start the server
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold));

//Handle unhandled rejections
process.on('unhandledRejection',(err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});