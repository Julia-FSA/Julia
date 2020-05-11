const axios = require('axios')
const {SpoonacularAPIKey} = require('../../../secrets.js')
const router = require('express').Router()
module.exports = router

const ingredientFormatter = ingredient => {
  let ingr = {
    id: ingredient.id,
    aisle: ingredient.aisle,
    name: ingredient.name,
    imageURL: ingredient.image,
    unit: ingredient.possibleUnits
  }
  return ingr
}

router.get('/byName/:name', (req, res, next) => {
  let name = req.params.name
  try {
    axios
      .get(
        `https://api.spoonacular.com/food/ingredients/autocomplete?query=${name}&metaInformation=true&number=1&apiKey=${SpoonacularAPIKey}`
      )
      .then(ingredient => {
        res.json(ingredientFormatter(ingredient.data[0]))
      })
  } catch (error) {
    next(error)
  }
})

router.get('/byId/:id', (req, res, next) => {
  let id = req.params.id
  try {
    axios
      .get(
        `https://api.spoonacular.com/food/ingredients/${id}/information?amount=1&apiKey=${SpoonacularAPIKey}`
      )
      .then(ingredient => {
        res.json(ingredientFormatter(ingredient.data))
      })
  } catch (error) {
    next(error)
  }
})
