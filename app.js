const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const userController = require('./controllers/userController');
const app = express();

// Configura o EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Middleware para parsing do body
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'seu-segredo-aqui',
    resave: false,
    saveUninitialized: true
}));

// Rotas
app.get('/', userController.getAllUsers);
app.get('/add', (req, res) => res.render('add'));
app.post('/add', userController.addUser);
app.get('/edit/:id', userController.getUserById);
app.post('/edit/:id', userController.updateUser);
app.get('/dell/:id', userController.getdeleteByUser);
app.post('/dell/:id', userController.deleteUser);

// Rota para exibir a página de login
app.get('/login', userController.showLoginPage);

// Rota para processar o login
app.post('/login', userController.loginUser);

// Rota para exibir a página de cadastro
app.get('/signup', userController.showSignupPage);

// Rota para processar o cadastro
app.post('/signup', userController.signupUser);

app.get('/logout', userController.logout); 

// Iniciar o servidor
app.listen(2000, () => {
    console.log('Servidor rodando na porta 2000');
});
