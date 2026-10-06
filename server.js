const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser')
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    //message: "Muitas requisições de IP. Tente novamente mais tarde"
});
// app.use(limiter);

app.use(cors({
    origin:"https://localhost:5173",
    credentials: true
}));



