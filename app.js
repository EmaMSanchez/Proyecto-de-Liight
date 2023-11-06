const express = require("express");
const mysql = require("mysql");
const app = express();

const conexion = mysql.createConnection({
    host: "localhost",
    database:"crudusuarios",
    user:"root",
    password:"root0507"
});



app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.get("/",function(req,res){
    res.render("index");
});

app.post("/auth", function (req, res) {
  const { usuario, password } = req.body;

  // Realiza una consulta a la base de datos para verificar las credenciales del usuario
  const query = "SELECT * FROM usuarios WHERE Usuario = ? AND Contraseña = ?";
  conexion.query(query, [usuario, password], function (err, result) {
    if (err) {
      // Maneja cualquier error de la consulta
      res.redirect("/");
    } else {
      if (result.length > 0) {
        // Las credenciales son correctas, redirige al usuario a "/home"
        res.redirect("/home");
      } else {
        // Credenciales incorrectas, redirige al usuario de nuevo a "/"
        res.redirect("/");
      }
    }
  });
});

app.get("/singup", function (req, res) {
    res.render("pages/singUp2", { currentPage: req.originalUrl });
  });

  app.get("/crear", function (req, res) {
    res.render("pages/crear.ejs", { currentPage: req.originalUrl });
  });

 

  //Agregar Usuario
 
  app.post("/validarNuevo", function (req, res) {
    const datoSingUp = req.body;
    let nombre = datoSingUp.nombre;
    let apellido = datoSingUp.apellido;
    let correo = datoSingUp.correo;
    let usuario = datoSingUp.usuario;
    let password = datoSingUp.password;
    
    let buscar = "SELECT * FROM usuarios WHERE Correo = '"+correo+"' ";

    conexion.query(buscar, function(err,row){
        if(err){
            throw err;
        }else{
            if(row.length>0){
                console.log("Usuario Existente")
            }else{

                let registrar = "INSERT INTO usuarios (Nombre, Apellido, Correo, Usuario, Contraseña) VALUES ('"+nombre+"','"+apellido+"','"+correo+"','"+usuario+"','"+password+"')";

    conexion.query(registrar, function(err){
        if(err){
            throw err;
        }else{
            console.log("Usuario agregado");
            res.redirect("/");
        }
    });
            }
        }
    });

    
    
  });

  app.post("/validarNuevo2", function (req, res) {
    const datoSingUp = req.body;
    let nombre = datoSingUp.nombre;
    let apellido = datoSingUp.apellido;
    let correo = datoSingUp.correo;
    let usuario = datoSingUp.usuario;
    let password = datoSingUp.password;
    
    let buscar = "SELECT * FROM usuarios WHERE Correo = '"+correo+"' ";

    conexion.query(buscar, function(err,row){
        if(err){
            throw err;
        }else{
            if(row.length>0){
                console.log("Usuario Existente")
            }else{

                let registrar = "INSERT INTO usuarios (Nombre, Apellido, Correo, Usuario, Contraseña) VALUES ('"+nombre+"','"+apellido+"','"+correo+"','"+usuario+"','"+password+"')";

    conexion.query(registrar, function(err){
        if(err){
            throw err;
        }else{
            console.log("Usuario agregado");
            res.redirect("/home");
        }
    });
            }
        }
    });

    
  });

  
//Editar Usuarios

// Ruta para traer el usuario a editar 
app.get("/editar/:id", function (req, res) {
    const userId = req.params.id; 
    const buscarUsuario = "SELECT * FROM usuarios WHERE IdUser = ?";
    
    conexion.query(buscarUsuario, [userId], function (err, usuario) {
      if (err) {
        throw err;
      } else {
        res.render("pages/editar", { usuario: usuario[0] });
      }
    });
  });
  
  // Ruta para procesar la edición del usuario
app.post("/editar/:id", function (req, res) {
    const userId = req.params.id;
    const datosEditar = req.body;
    const actualizarUsuario = "UPDATE usuarios SET Nombre = ?, Apellido = ?, Correo = ?, Usuario = ?, Contraseña = ? WHERE IdUser = ?";
    
    conexion.query(
      actualizarUsuario,
      [datosEditar.nombre, datosEditar.apellido, datosEditar.correo, datosEditar.usuario, datosEditar.password, userId],
      function (err) {
        if (err) {
          throw err;
        } else {
          res.redirect("/home");
        }
      }
    );
  });

  //Eliminar Usuario
 
app.get("/eliminar/:id", function (req, res) {
    const userId = req.params.id;
    const eliminarUsuario = "DELETE FROM usuarios WHERE IdUser = ?";
    
    conexion.query(eliminarUsuario, [userId], function (err) {
      if (err) {
        throw err;
      } else {
        res.redirect("/home");
      }
    });
  });

  app.get("/home", function (req, res) {
    const usuariosQuery = "SELECT * FROM usuarios"; 
    
    conexion.query(usuariosQuery, function (err, usuarios) {
      if (err) {
        throw err;
      } else {
        res.render("pages/home2", {  usuarios: usuarios });
      }
    });
  });
  


app.use(express.static("public"));


app.use(express.static("public"));

app.listen(3000,function(){
    console.log("El servidor es http://localhost:3000")
});