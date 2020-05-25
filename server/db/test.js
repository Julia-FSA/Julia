const {SpoonacularAPIKey} = require('../../secrets')
const axios = require('axios')
async function find(name) {
  const cool = await axios.get(
    `https://api.spoonacular.com/food/ingredients/autocomplete?query=${name}&number=2&apiKey=${SpoonacularAPIKey}`
  )
  console.log(cool.data)
}

find('skat')
