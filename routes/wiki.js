const wikiRouter = require('express').Router()

wikiRouter.get('/',(req,res)=>{
    res.send('Wiki homepage')
})

wikiRouter.get('/about',(req,res)=>{
    res.send('About this wiki')
})

module.exports = wikiRouter