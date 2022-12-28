const express = require("express");
const router = express.Router();
const usuario = require("../moldes/Usuarios");
const bcrypt = require("bcryptjs");
const sequelize = require("../moldes/Conexao");
const passport = require("passport")

router.get("/cadastro", (req, res)=>{
    res.render("usuarios/cadastroUser")
})

router.post("/cadastro", (req, res)=>{
    const Usuario = {
        nome:req.body.nome,
        email:req.body.email,
        senha:req.body.senha
    }
    const erro = []
    for(const key in Usuario){
        if(!Usuario[key] || typeof Usuario[key] == undefined || Usuario[key] == null){
            erro.push({text:key+" Invalido"});
        }
    }
    console.log(Usuario.email)
    if(erro.length > 0){
        res.render("usuarios/cadastroUser",{texto:erro})
    }else{
        usuario.findAll({where:{email:Usuario.email}}).then((email)=>{
            if(email.length > 0){
                req.flash("error", "email já está cadastrado")
                res.redirect("/");
            }else{
                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(Usuario.senha, salt, (erro,hash)=>{
                        if(erro){
                            req.flash("error", "errou ao cadastrar")
                            res.redirect("/")
                        }
                        Usuario.senha = hash

                        usuario.create(Usuario).then(()=>{
                            req.flash("success", "cadastrado com sucesso")
                            res.redirect("/")
                        }).catch((erro)=>{
                            req.flash("error", "erro404");
                            res.redirect("/");
                        })
                    })
                })
            }
        }).catch((erro)=>{
            req.flash("error", "ocorreu um erro"+ erro)
            res.redirect("/");
        })
    }
    
})

router.get("/login", (req, res)=>{
    res.render("usuarios/loginUser")
})

router.post("/login", 
        passport.authenticate("local", {
        failureRedirect:"/usuario/login",
        failureFlash: true
    }),((req, res) => {
        res.redirect("/")
    })

)

router.get("/sair", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        res.redirect("/")
    })
})

module.exports = router