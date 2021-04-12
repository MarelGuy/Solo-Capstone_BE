const app = require("express").Router()
const scpModel = require("../../schemas/scpModel")

app.get('/', async (req, res, next) => {
    try {
        const SCP = await scpModel.find().populate("user")
        if (SCP.lenth === 0) {
            res.status(404).send("Error 404, maybe there aren't any scps in the db?")
        } else {
            res.status(200).send(SCP)
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.get('/:id', async (req, res, next) => {
    try {
        const SCP = await scpModel.findById(req.params.id).populate(["user", "linked_Documents"])
        res.status(200).send(SCP)
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/', async (req, res, next) => {
    try {
        const { _id } = await new scpModel(req.body).save()
        res.status(201).send(_id)
    } catch (err) {
        console.log(err);
        next(err);
    }
});


app.put('/:id', async (req, res, next) => {
    try {
        await scpModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).send("SCP updated!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/:id', async (req, res, next) => {
    try {
        await scpModel.findByIdAndDelete(req.params.id, req.body)
        res.status(201).send("SCP deleted!")
    } catch (err) {
        console.log(err);
        next(err);
    }
})

app.post('/like/:id', async (req, res, next) => {
    try {
        await scpModel.findByIdAndUpdate(req.params.id, {
            $push:
            {
                likes: req.body
            }
        })
        res.status(201).send("SCP liked!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/like/:id/:likeId', async (req, res, next) => {
    try {
        await scpModel.findByIdAndUpdate(req.params.id, {
            $pull:
            {
                likes: { _id: req.params.likeId }
            }
        })
        res.status(201).send("SCP unliked!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = app