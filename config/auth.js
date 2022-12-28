const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const usuario = require("../moldes/Usuarios")

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField:'senha'}, (email, senha, done)=>{
        usuario.findOne({where:{email:email}}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message:'Email Invalido'})
            }
            bcrypt.compare(senha, usuario.senha, (erro, batem)=>{

                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false,{message: "Senha incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done)=>{
        done(null, usuario.id)
    })


    passport.deserializeUser((id, done)=>{
        usuario.findByPk(id).then((usuario)=>{
            done(null, usuario)
        }).catch((err)=>{
            done(err, usuario)
        })
    })



}