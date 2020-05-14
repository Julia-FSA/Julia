const crypto = require('crypto')

const correctPassword = function(candidatePwd) {
  return encryptPassword(candidatePwd, this.salt()) === this.password()
}

const generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

const encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}
// User.beforeCreate(setSaltAndPassword)
// User.beforeUpdate(setSaltAndPassword)
// User.beforeBulkCreate(users => {
//   users.forEach(setSaltAndPassword)
// })
