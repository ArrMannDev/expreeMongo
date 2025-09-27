const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedUser(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync(faker.internet.password(), 10),
    });
  }

  try {
    await prisma.user.createMany({ data: users }); //createMany ka array pay ya ml create ka 1 khu pl
    console.log(`${count} users created`);
  } catch (error) {
    console.error("Error seeding users", error);
  }
}

async function seedPost(count) {
  const posts = [];
  for (let i = 0; i < count; i++) {
    const user = await prisma.user.findFirst({ select: { id: true } });

    if (!user) throw new Error("No user found");

    posts.push({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      authorId: user.id,
    });
  }

  try {
    await prisma.posts.createMany({ data: posts });
    console.log(`${count} posts created`);
  } catch (error) {
    console.log("Error seeding posts", error);
  }
}

async function main() {
  try {
    await seedUser(10);
    await seedPost(10);
  } catch (error) {
    console.error("Error in main", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
