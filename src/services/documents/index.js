const docModel = require("../../schemas/docModel")
const scpModel = require("../../schemas/scpModel")
const { authorize } = require("../../utils/middleware")
const app = require("express").Router()

app.get('/', async (req, res, next) => {
    try {
        const doc = await docModel.find().populate("user")
        if (doc.lenth === 0) {
            res.status(404).send("Error 404, maybe there aren't any docs in the db?")
        } else {
            res.status(200).send(doc)
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.get('/:id', async (req, res, next) => {
    try {
        const doc = await docModel.findById(req.params.id).populate("user")
        res.status(200).send(doc)
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/:scpId', async (req, res, next) => {
    try {
        const doc = await new docModel(req.body)
            .save()
        console.log(doc._id)
        await scpModel.findByIdAndUpdate(req.params.scpId, {
            $push: {
                linked_Documents: { _id: doc._id }
            }

        })
        res.status(201).send(doc._id)
    } catch (err) {
        console.log(err);
        next(err);
    }
});


app.put('/:id', async (req, res, next) => {
    try {
        await docModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).send("doc updated!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/:id', async (req, res, next) => {
    try {
        await docModel.findByIdAndDelete(req.params.id, req.body)
        await scpModel.findByIdAndUpdate(req.params.id, {
            $pull: {
                linked_Documents: req.params.id
            }
        })
        res.status(201).send("doc deleted!")
    } catch (err) {
        console.log(err);
        next(err);
    }
})

app.post('/like/:id', authorize, async (req, res, next) => {
    try {
        const doc = await docModel.findOne({ _id: req.params.id })
        if (doc.likes.findIndex(like => like.userId.toString() === req.user._id.toString()) === -1) {
            await docModel.findByIdAndUpdate(req.params.id, {
                $push:
                {
                    likes: req.body
                }
            })
            const doc_updated = await docModel.findOne({ _id: req.params.id }).populate(["linked_Documents", "user"])
            return res.send(doc_updated)
        } else {
            await docModel.findByIdAndUpdate(req.params.id, {
                $pull:
                {
                    likes: { userId: req.user._id }
                }
            })
            const doc_updated = await docModel.findOne({ _id: req.params.id }).populate(["linked_Documents", "user"])
            return res.send(doc_updated)
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = app