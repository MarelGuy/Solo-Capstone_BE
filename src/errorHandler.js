const badRequestHandler = (err, req, res, next) => {
    if (err.httpStatusCode === 400 || err.statusCode === 400) {
        res.status(400).send({ error: err.message || "Bad Request" });
    }
    next(err);
};

const notFoundHandler = (err, req, res, next) => {
    if (err.httpStatusCode === 404 || err.statusCode === 404) {
        res.status(404).send({ error: err.message || "Not Found" });
    }
    next(err);
};

const unauthorizedHandler = (err, req, res, next) => {
    if (err.httpStatusCode === 401 || err.statusCode === 401) {
        res.status(401).send({ error: err.message || "Unauthorized" });
    }
    next(err);
};

const forbiddenHandler = (err, req, res, next) => {
    if (err.httpStatusCode === 403 || err.statusCode === 403) {
        res.status(403).send({ error: err.message || "Forbidden" });
    }
    next(err);
};

const catchAllHandler = (err, req, res, next) => {
    if (!res.headersSent) {
        console.log(err);
        res
            .status(err.httpStatusCode || 500)
            .send({ error: err.message || "Generic Server Error" });
    }
};

module.exports = {
    notFoundHandler,
    unauthorizedHandler,
    forbiddenHandler,
    badRequestHandler,
    catchAllHandler,
};
