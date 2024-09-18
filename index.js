const express = require("express");
const appRoute = require("./routes/index");
const bodyParser = require("body-parser");
const cors = require("cors");
// const session = require("express-session");
// const session = require('cookie-session');
// const MongoStore = require('connect-mongo') 
const app = express();
const {
  Login,
  Register,
  VerifyUser,
  ValidUserSess,
  Logout,
} = require("./controllers/Auth");
const {
  CheckValidationAuth,
  CheckValidationRegister,
} = require("./config/Checker");
const ApiResponse = require("./config/ApiResponse");

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
//   session({
//     secret: "keyboard cat",
//     name: "sess",
//     resave: false,
//     store: MongoStore.create({ mongoUrl: process.env.URL_MONGOSE}),
//     saveUninitialized: true,
//     cookie: { secure: false, maxAge: 60000 },
//   })
// );
// app.use(session({
//   name: 'sess',
//   keys: ['secret_key'],
//   //Pastikan cookie hanya dikirimkan melalui HTTPS
//   maxAge: 60000 // Durasi cookie session (dalam milidetik), contoh 24 jam
// }));


 
app.use(bodyParser.json());
 
app.use(
  cors({
    origin: ["https://ruangan-impostor.vercel.app","http://localhost:3000"],
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.get("/",(req,res)=>{
  res.status(200).send({msg:"welcome to api ruangpromkes"})
});
app.post("/login", CheckValidationAuth, VerifyUser, Login);
app.post("/register", CheckValidationRegister, Register);
app.post("/logout", Logout);
app.use("/", appRoute);
app.listen(8080);
