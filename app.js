const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

//middleware
// const authMiddleware = require("./middleware/authMiddleware");

//route
const authRoute = require("./routes/authRoutes");
// const postRoute = require("./routes/postRoutes");
// const indexRoutes = require("./routes/indexRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true, limit:"1mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: process.env.SECRET_KEY,resave:false,saveUninitialized:false}));

app.use(expressLayouts);
app.use((req,res,next)=>{
    res.locals.userId = req.session.userId;
    res.locals.name = req.session.name;
    res.locals.role = req.session.role;
    next();
})

app.use("/",(req,res)=>{
    res.end("hello");
})

app.use("/auth",authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
