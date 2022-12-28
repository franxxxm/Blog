const conexao = require("./Conexao");

const usuario = conexao.sequelize.define("usuario",{
    nome:{
        type: conexao.Sequelize.STRING,
        required:true
    },
    email:{
        type: conexao.Sequelize.STRING,
        required:true
    },
    senha:{
        type: conexao.Sequelize.STRING,
        required:true
    },
    admin:{
        type: conexao.Sequelize.INTEGER,
        defaultValue:0,
    }
})


module.exports = usuario