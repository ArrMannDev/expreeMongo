const bcrypt = require("bcryptjs");
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

exports.getRegister = (_,res)=>{
    res.render('auth/register',{title:"Register"});
}

exports.postRegister = async (req,res)=>{
    const {name,email,password} = req.body;

    try{
        const exitingUser = await prisma.user.findUnique({where:{email}});
        if(exitingUser){
            res.status(400).render("auth/register",{
                title:"Register",
                error:"Email already in use"
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await prisma.user.create({
            data:{name,email,password:hashedPassword}
        });
        if(user){
            res.redirect("/auth/login");
        }
    }catch(error){
        console.error("Error during registration",error);
        res.status(500).send("An error occure during registration");
    }
}

exports.getLogin = (_req,res)=>{
    res.render("auth/login",{title:"Login"});
}

exports.postLogin = async (req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(401).render("auth/login",{
                title:"Login",
                error:"Email not found"
            })
        }

        if(user && await bcrypt.compare(password,user.password)){
            req.session.userId = user.id;
            req.session.name = user.name;
            req.session.role = "Super Admin";
            return res.redirect("/");
        }
    }catch(error){
        console.log("Error during login",error);
        res.status(500).send("An error occure during login");
    }
}

exports.getLogout = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/")
    })
}

