const bcrypt = require('bcrypt')

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}
const verifyPassword = (password, hash) => {
    return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, verifyPassword };