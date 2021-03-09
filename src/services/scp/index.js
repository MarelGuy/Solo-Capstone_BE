const app = require("express").Router()
const scpModel = require("../../schemas/scpModel")

app.get('/', async (req, res, next) => {
    try {
        const scp = await scpModel.find().populate("user")
        if (scp.lenth === 0) {
            res.status(404).send("Error 404, maybe there aren't any scps in the db?")
        } else {
            res.status(200).send(scp)
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.get('/:id', async (req, res, next) => {
    try {
        const scp = await scpModel.findById(req.params.id).populate("user")
        res.status(200).send(scp)
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/', async (req, res, next) => {
    try {
        await new scpModel(req.body).save()
        res.status(201).send("scp created!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.put('/:id', async (req, res, next) => {
    try {
        await scpModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).send("scp updated!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/:id', async (req, res, next) => {
    try {
        await scpModel.findByIdAndDelete(req.params.id, req.body)
        res.status(201).send("scp deleted!")
    } catch (err) {
        console.log(err);
        next(err);
    }
})

module.exports = app