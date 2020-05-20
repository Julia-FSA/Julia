const router = require('express').Router()
module.exports = router

router.use('/recipe', require('./recipe'))
router.use('/ingredient', require('./ingredient'))
router.use('/fridge', require('./fridge'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
