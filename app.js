//modulos
	const express = require("express");
	const exphbs = require("express-handlebars");
	const bodyParser = require("body-parser");
	const app = express();
	const admin = require("./routes/admin.js");
	const usuario = require("./routes/usuario");
	const path = require("path");
	const session = require("express-session");
	const flash = require("connect-flash");
	const categoria = require("./moldes/Categorias");//tabela categorai do banco de dados
	const post = require("./moldes/Postagens");
	const passport = require("passport");
	require("./config/auth")(passport)

	
// CONFIG tudo configs
	// Session
		app.use(session({
			secret: 'macacos',
			resave: true,
			saveUninitialized:true
		}));
		//confi passport
		app.use(passport.initialize());
		app.use(passport.session());

		app.use(flash());
// Middlaware
		app.use((req, res, next) =>{
			res.locals.success = req.flash("success");
			res.locals.error = req.flash("error");
			res.locals.user = req.user || null;
			next();	
		})

	//body-parser
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	//handlebars
	var handlebars = exphbs.create({
		defaultLayout: 'main',
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
	
			allowProtoMethodsByDefault: true,
		}
		});
	app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');
		// Public paginas staticas com css e js que serão chamadas no index
		app.use(express.static(path.join(__dirname,"public")));

//ROTAS rota principal admin onde todos vão ter admin/bláblá
	app.get("/", (req, res) =>{

		post.findAll({include:[{
			attributes:['nome','slug'],
			model:categoria
		}]}).then((dados)=>{
			res.render("admins/index",{dados:dados});
		}).catch((erro)=>{
			req.flash("error", "ocorreu um erro")
			res.redirect("/404");
		})
      })
	
	app.use("/usuario", usuario)
	app.use("/admin", admin);

//OUTRAS the basic
const PORT = 8081;
app.listen(PORT, () =>{
	console.log("Servidor rodado!");
})
