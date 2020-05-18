const router = require('express').Router()
module.exports = router

router.use('/recipe', require('./spoonacular/recipe'))
router.use('/ingredient', require('./spoonacular/ingredient'))
router.use('/fridge', require('./fridge'))
router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
