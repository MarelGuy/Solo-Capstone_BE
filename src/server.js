const express = require('express');
const mongoose = require('mongoose');

const {
    notFoundHandler,
    unauthorizedHandler,
    forbiddenHandler,
    badRequestHandler,
    catchAllHandler,
} = require("./errorHandler.js");

const port = process.env.PORT
const app = express();

const allRoutes = require("./services");

/* Middlewares */

const loggerMiddleware = (req, res, next) => {
    console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`);
    next();
};

app.use(express.json());
app.use(loggerMiddleware);

/* Routes */

app.use("/", allRoutes)

/* Error handler*/

app.use(unauthorizedHandler);
app.use(forbiddenHandler);
app.use(notFoundHandler);
app.use(badRequestHandler);
app.use(catchAllHandler);


mongoose
    .connect(
        process.env.MONGO_CONNECTION,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        },
        { autoIndex: false }
    )
    .then(() =>
        app.listen(port || 5000, () => {
            console.log("Running on port", port);
        })
    )
    .catch((err) => console.log(err));