const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

//Esta linha exporta a função para que ela possa ser usada em outras partes do aplicativo
exports.getAllUsers = (req, res) => {
  if(!req.session.user){
    res.redirect('/login');
  }

  // Esta linha chama uma função
  User.getAllUsers((users) => {

    //Depois que os dados do usuário são recuperados, o método é usado para renderizar a exibição.
    res.render("index", { users });
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;
  User.getUserById(userId, (user) => {
    res.render("edit", { user });
  });
};

///exibir usuário antes de deletar
exports.getdeleteByUser = (req, res) => {
  const userId = req.params.id;
  User.getUserById(userId, (user) => {
    res.render("dell", { user });
  });
};

exports.addUser = (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    fone: req.body.fone, 
    endereco: req.body.endereco
  };
  User.addUser(newUser, () => {
    res.redirect("/");
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const updatedUser = {
    name: req.body.name,
    email: req.body.email,
    fone: req.body.fone, 
    endereco: req.body.endereco
  };
  User.updateUser(userId, updatedUser, () => {
    res.redirect("/");
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  User.deleteUser(userId, () => {
    res.redirect("/");
  });
};

exports.showLoginPage = (req, res) => {
  res.render('login', { error: req.query.error });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  User.getUserByEmail(email, (user) => {
    if (user) {
      console.log('Senha fornecida pelo usuário: ', password);
      console.log('Hash da senha armazenada no banco de dados: ', user.password);

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log('Erro na comparação das senhas:', err);
          return res.redirect('/login?error=Erro na comparação das senhas');
        }

        if (isMatch) {
          console.log('Senhas coincidem!');
          req.session.user = user;
          return res.redirect("/"); // Redireciona para a página principal após login bem-sucedido
        } else {
          console.log('Senhas não coincidem!');
          return res.redirect('/login?error=Email ou senha incorretos');
        }
      });
    } else {
      console.log('Usuário não encontrado');
      return res.redirect('/login?error=Email ou senha incorretos');
    }
  });
};

// Exibir a página de cadastro
exports.showSignupPage = (req, res) => {
  res.render('cadastro', { error: req.query.error }); // A página de cadastro
};

// Processar o cadastro de um novo usuário
exports.signupUser = (req, res) => {
  const { name, email, password, fone, endereco } = req.body;

  User.getUserByEmail(email, (user) => {
    if (user) {
      return res.render('cadastro', { error: 'Este email já está registrado' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) throw err;

      const newUser = {
        name,
        email,
        password: hashedPassword,
        fone,
        endereco
      };

      User.addUser(newUser, () => {
        res.redirect('/login');
      });
    });
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
