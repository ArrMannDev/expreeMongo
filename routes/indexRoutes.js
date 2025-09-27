const router = require("express").Router();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/",async(req,res)=>{
    try{
        const {page=1 ,perPage=8} = req.query;
        const skip = (page-1)*perPage;
        const posts = await prisma.post.findMany({
            skip,
            take:Number(perPage),
        });
        const totalPosts = await prisma.post.count();
        res.render("index",{
            title:"Home",
            posts,
            page:parseInt(page),
            perPage:parseInt(perPage),
            totalPosts,
            totalPages:Math.ceil(totalPosts/perPage),
        });
    }catch(error){
        console.log("Error Fetching Posts",error);
        res.status(500).send("An error occurred while fetching posts")
    }
})