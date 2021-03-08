const app = require('express').Router()
const commentRouter = require('./comment')
const forumRouter = require('./forum')
const scpRouter = require('./scp')
const userRouter = require('./user')


app.use("/comment", commentRouter)
app.use("/forum", forumRouter)
app.use("/scp", scpRouter)
app.use("/user", userRouter)

module.exports = app