const app = require("express").Router()
const scpModel = require("../../schemas/scpModel")

app.get('/', (req, res, next) => {
    try {

    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.get('/:id', (req, res, next) => {
    try {

    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/', (req, res, next) => {
    try {

    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.put('/:id', (req, res, next) => {
    try {

    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/:id', (req, res, next) => {
    try {

    } catch (err) {
        console.log(err);
        next(err);
    }
})

module.exports = app