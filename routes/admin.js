const express = require("express");//puxando express
const router = express.Router();//puxando bghl do expresse de router 
const sequelize = require("../moldes/Conexao");//conexao do sequelize para poder usar o like 
const categoria = require("../moldes/Categorias");//tabela categorai do banco de dados
const post = require("../moldes/Postagens");
const Op = sequelize.Sequelize.Op;//aqui chamndo  ongc para selecionar as coisas no banco de dados
const {admin} = require("../helpers/admin");

router.get("/", admin, (req, res)=>{
    res.render("admins/index");
})

router.get("/post", admin, (req, res) =>{
    res.send("ola meu caro amigo")
})

router.get("/postagem/:slug",  (req,res)=>{
    post.findOne({where:{slug:req.params.slug}}).then((dados)=>{
        if(dados){
            res.render("postagem/index",{dados:dados});
        }else{
            req.flash("error", "essa postagem não foi encontrada");
            res.redirect("/");
        }
    }).catch((erro)=>{
        req.flash("error", "houve um erro")
        res.redirect("/");
    })
})

router.get("/categorias", admin, (req, res) =>{
    categoria.findAll({order:[["id", "DESC"]]}).then((dados)=>{
        res.render("admins/categorias",{dados:dados});
    }).catch((erro)=>{
        req.flash("error", "ocorreu um erro ao listar categorias "+ erro);
        res.redirect("/admin");
    })
    
})
     

router.get("/categorias/add", admin, (req, res) =>{
    res.render("admins/addCategorias");   
    
})

router.post("/categorias/nova", admin, (req, res) =>{
   
    const categoriau = {
        nome: req.body.nome,
        slug: req.body.slug
        }
        var erros = [];
     
        if(req.body.nome == null || req.body.nome == ""){
         erros.push({texto:"não tem nada filho da puta"});
        }
        if(req.body.slug == null || req.body.slug == ""){
            erros.push({texto:"sla"});
           }

        if(erros.length > 0){
         res.render("../views/admins/addCategorias.handlebars",{erros:erros});
        }else{
         categoria.create(categoriau).then(()=>{
            req.flash("success", "categoria foi cadastrada com sucesso");
             res.redirect("/admin/categorias");
         }).catch((erro)=>{
            req.flash("error", "erro ao cadastrar categoria, tente novamente");
             res.send("o erro" + erro);
         });
        }
   
})

    router.get("/categorias/edite/:id", admin, (req,res)=>{
        categoria.findAll({where:{id:req.params.id}}).then((dados)=>{
            if(dados.length < 1){
                req.flash("error","essa categoria não existe");
                res.redirect("/admin/categorias");
            }
            res.render("../views/admins/editCategorias.handlebars", {dados:dados});
        }).catch((erro)=>{
            res.redirect("/admin/categorias");
        })
        
    })

    router.post("/categorias/edite", admin, (req, res)=>{


       var erros = [];

       if(req.body.nome == null || req.body.nome == ""){
        erros.push({texto:"campo titulo vazio"});
       }
       if(req.body.slug == null || req.body.slug == ""){
        erros.push({texto:"campo comentario vazio"});
       }
       if(erros.length > 0){
        categoria.findAll({where:{id:req.body.id}}).then((dados)=>{
            res.render("../views/admins/editCategorias.handlebars",{dados:dados, erros:erros});
        })
       }else{
        categoria.update({
            nome:req.body.nome,
            slug:req.body.slug
        }, {where:{id:req.body.id}}
            ).then(()=>{
            req.flash("success", "Editado com sucesso");
            res.redirect("/admin/categorias");
            }).catch(()=>{
            req.flash("error", "erro ao editar, tente novamente");
            res.redirect("/admin/categorias");
            })
       }     
})


router.post("/categorias/delete", admin, (req, res)=>{
    categoria.destroy({where:{id:req.body.id}}).then(()=>{
        req.flash("success", "Deletado com sucesso");
        res.redirect("/admin/categorias");
    }).catch((erro)=>{
        req.flash("error", "Não foi possível deletar sua categoria");
        res.redirect("/admin/categorias");
    })
   })

router.get("/postagens", admin, (req,res)=>{
    post.findAll({
        order:[['id','DESC']],
        include:[{
            attributes:['nome','slug'],
            model:categoria
        }]
    }).then((dados)=>{    
        console.log(dados)
        res.render("../views/admins/postagens.handlebars",{dados:dados});
    }).catch(()=>{
        req.flash("error", "Não foi possível exibir a pagina postagen");
        res.redirect("/admin");
    })
    
})
router.get("/postagens/add", admin, (req,res) =>{
    categoria.findAll().then((dados)=>{
        res.render("../views/admins/addPostagens.handlebars",{dados:dados});
    }).catch((erro)=>{
        req.flash('error', 'Houve um erro ao criar postagem');
        res.redirect("/admin/postagens");
    })
    
})

router.post("/postagens/nova", admin, (req,res)=>{
    const erro = [];

    if(req.body.categoria == '0'){
        erro.push({text:'Categoria inválida, registre um categoria'})
    }
    if(erro.length > 0){
        res.render("../views/admins/addPostagens.handlebars", {erros:erro});
    }else{
        const novapostagem = {
            titulo:req.body.titulo,
            slug:req.body.slug,
            descricao:req.body.desc,
            conteudo:req.body.conteudo,
            idcategoria:req.body.categoria

        }
        post.create(novapostagem).then(()=>{
            req.flash('success', 'Postagem criada com sucesso');
            res.redirect("/admin/postagens");
        }).catch((erro)=>{
            req.flash('error', 'Não foi possivel criar postagem');
            res.redirect("/admin/postagens");
        })
    }
})

    router.get("/postagens/edite/:id", admin, (req, res) =>{
        post.findOne({where:{id:req.params.id}}).then( (postagens)=>{
            if(postagens.length === 0){
                res.redirect("/admin/postagens")
            }
            categoria.findAll().then((categorias)=>{
                res.render("../views/admins/editPostagens.handlebars", {postagens:postagens, categorias:categorias});
            }).catch(()=>{
                req.flash("error", "erro ao encontrar dados de categoria");
                res.redirect("/admin/postagens")
            })
        }).catch((erro)=>{
            req.flash("error", "erro ao encontrar dados da postagem")
            res.redirect("/admin/postagens");
        })

        
    })
    router.post("/postagens/edite", admin, (req, res)=>{
        if(req.body.categoria == 0){
            req.flash("error", "nenhunma categoria foi selecionada");
            res.redirect("/admin/postagens");
        }else{ 
            post.update({titulo:req.body.titulo,
                slug:req.body.slug,
                descricao:req.body.desc,
                conteudo:req.body.conteudo,
                idcategoria:req.body.categoria },{where:{id:req.body.id}}).then(()=>{
                req.flash("success", "Postagem editada com sucesso")
                res.redirect("/admin/postagens")
            }).catch(()=>{
                req.flash("error", "erro ao editar postagem")
                res.redirect("/admin/postagens");
            })
        }
    })
    //testes
    router.route("/ajax").get((req,res) =>{
        res.render("../views/ajax.handlebars");
    })
    router.post("/ajax",(req,res)=>{
       var dados = "%"+req.body.pesquisa+"%";
       //fazendo consulta com like no banco de dados
       categoria.findAll({where:{nome:{[Op.like]:dados}}}).then((cate)=>{
            res.send({dados:cate})
        }).catch((erro)=>{
            console.log('oi')
        })
        
       })
                   
    
module.exports  =  router;
