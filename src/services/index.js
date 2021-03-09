const app = require('express').Router()
const forumRouter = require('./forum')
const scpRouter = require('./scp')
const userRouter = require('./user')

app.use("/forum", forumRouter)
app.use("/scp", scpRouter)
app.use("/user", userRouter)

module.exports = app