const conexao = require("./Conexao");

    const categoria = conexao.sequelize.define('categorias', {
        nome:{
            type: conexao.Sequelize.STRING
        },
        slug:{
            type: conexao.Sequelize.STRING
        }
    })

    
 

    module.exports = categoria;