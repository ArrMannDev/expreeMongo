const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Home route with pagination
router.get("/", async (req, res) => {
    try {
        const { page = 1, perPage = 8 } = req.query;
        const skip = (page - 1) * perPage;

        const posts = await prisma.post.findMany({
            skip,
            take: Number(perPage),
        });

        const totalPosts = await prisma.post.count();

        res.render("index", {
            title: "Home",
            posts,
            page: parseInt(page),
            perPage: parseInt(perPage),
            totalPosts,
            totalPages: Math.ceil(totalPosts / perPage),
        });
    } catch (error) {
        console.log("Error Fetching Posts", error);
        res.status(500).send("An error occurred while fetching posts");
    }
});

// Search route
const getSearchPosts = async (req, res) => {
    const { title } = req.query;
    try {
        const posts = await prisma.post.findMany({
            where: { title: { contains: title, mode: "insensitive" } },
        });
        res.render("index", { posts, title: "Search Results" });
    } catch (error) {
        console.log("Error in Searching Posts", error);
        res.status(500).send("An error occurred in Searching Posts");
    }
};

// Use search route
router.get("/search", getSearchPosts);

// Export router
module.exports = router;
