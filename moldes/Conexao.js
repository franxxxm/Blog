const Sequelize = require("sequelize");
const sequelize = new Sequelize('sistema_de_cadastro','root','', {
    host:'localhost',
    dialect: 'mysql'
})

module.exports = {
    Sequelize,
    sequelize
}