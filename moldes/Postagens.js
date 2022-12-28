const conexao = require("./Conexao");
const categoria = require("./Categorias");

   const post = conexao.sequelize.define('postagens',{
        titulo:{
            type: conexao.Sequelize.STRING,
            required:true
        },
        slug:{
            type:conexao.Sequelize.STRING,
            required:true
        },
        descricao:{
            type:conexao.Sequelize.STRING,
            required:true
        },
        conteudo:{
            type:conexao.Sequelize.STRING,
            required:true
        },
        idcategoria:{
            type: conexao.Sequelize.INTEGER,
            references:{model:'categorias', key:'id'},
            required:true,
            allowNull:false
        }
    })

    post.belongsTo(categoria,{foreignKey:'idcategoria', allowNull:false});
    

    module.exports = post;