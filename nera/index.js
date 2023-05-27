
//Configs padrões
const express = require("express");
const session = require("express-session");
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const User = require('./models/User');

//Configs da sessão
app.use(session({
    name: 'teste',
    secret: 'adsadsadsdasaadadss',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

// carregando o cabeçalho do html em outras páginas

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/img'));

// rota principal 
app.get('/', function (req, res) {
});

// rota para login do professor
app.get('/log', function (req, res) {
    res.render('formLogin_Professor');
});

//rota para login do aluno
app.get('/log-aluno', function (req, res) {
    res.render('formLogin_Aluno');
});

app.get('/cad', function (req, res) {
    res.render('formCadatro');
});

// procurando usuario e senha no banco
app.post('/login', function (req, res) {

    User.findOne({
        where: {
            email: req.body.user,
            senha: req.body.senha
        }
    }).then(function (result) {
        if (result) {
            req.session.login = result.id_tipo_usuario;
            console.log(req.session.login);
            res.render('home')
        } else {
            res.render('formulario')
        }

    });
});

app.post('/cadastro', function (req, res) {
    User.create({
        email: req.body.email_cad,
        senha: req.body.senha_cad
    })
        .then(function () {
            //redirecionando para home com o barra
            res.redirect('/log')
        }).
        catch(function (erro) {
            res.send('"Houve um erro: ' + erro);
        });
});

app.listen(8081, function () {
    console.log("Servidor rodando");
});