const app = require("express").Router()
const scpModel = require("../../schemas/scpModel")
const { authorize } = require("../../utils/middleware")

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
        const SCP = await scpModel.findById(req.params.id).populate(["linked_Documents", "user"])
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

app.put('/:id', authorize, async (req, res, next) => {
    try {
        const scp = await scpModel.findByIdAndUpdate(req.params.id, req.body)
        if (req.user._id === scp.user)
            res.status(201).send("SCP updated!")
        else
            res.status(401).send("Not authorized!")
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

app.post('/like/:id', authorize, async (req, res, next) => {
    try {
        const scp = await scpModel.findOne({ _id: req.params.id })
        if (scp.likes.findIndex(like => like.userId.toString() === req.user._id.toString()) === -1) {
            await scpModel.findByIdAndUpdate(req.params.id, {
                $push:
                {
                    likes: req.body
                }
            })
            const scp_updated = await scpModel.findOne({ _id: req.params.id }).populate(["linked_Documents", "user"])
            return res.send(scp_updated)
        } else {
            await scpModel.findByIdAndUpdate(req.params.id, {
                $pull:
                {
                    likes: { userId: req.user._id }
                }
            })
            const scp_updated = await scpModel.findOne({ _id: req.params.id }).populate(["linked_Documents", "user"])
            return res.send(scp_updated)
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = app