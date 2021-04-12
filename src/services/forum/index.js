const app = require("express").Router()
const forumModel = require("../../schemas/forumModel")

app.get('/', async (req, res, next) => {
    try {
        const forum = await forumModel.find().populate("user")
        if (forum.lenth === 0) {
            res.status(404).send("Error 404, maybe there aren't any forums in the db?")
        } else {
            res.status(200).send(forum)
        }
        res.end()
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.get('/:id', async (req, res, next) => {
    try {
        const forum = await forumModel.findById(req.params.id).populate(["user", "comments.userId"])
        res.status(200).send(forum)

    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/', async (req, res, next) => {
    try {
        const { _id } = await new forumModel(req.body).save()
        res.status(201).send(_id)
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.put('/:id', async (req, res, next) => {
    try {
        await forumModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).send("Forum updated!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/:id', async (req, res, next) => {
    try {
        await forumModel.findByIdAndDelete(req.params.id, req.body)
        res.status(201).send("Forum deleted!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.get('/:id/comment', async (req, res, next) => {
    try {
        const comments = await forumModel.find()
        res.send(comments.comments)
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/:id/comment', async (req, res, next) => {
    try {
        await forumModel.findByIdAndUpdate(req.params.id, {
            $push:
            {
                comments: {
                    userId: req.body.userId,
                    content: req.body.content
                }
            }
        })
        res.status(201).send("forum commented!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.delete('/:id/comment/:commentId', async (req, res, next) => {
    try {
        await forumModel.findByIdAndUpdate(req.params.id, {
            $pull:
            {
                comments: { _id: commentId }
            }
        })
        res.status(201).send("scp commented!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.put('/:id/comment/:commentId', async (req, res, next) => {
    try {
        const body = req.body
        await forumModel.findByIdAndUpdate(req.params.id, {
            $set:
            {
                comments: {
                    _id: commentId,
                    body
                }
            }
        })
        res.status(201).send("scp commented!")
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/like/:id', async (req, res, next) => {
    try {
        await forumModel.findByIdAndUpdate(req.params.id, {
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
        await forumModel.findByIdAndUpdate(req.params.id, {
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