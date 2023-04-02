import { PrismaClient, UserRole, type Category } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const selectUserRole = (i: number) => {
  switch (i) {
    case 0:
      return UserRole.ADMIN;
    case 1:
    case 2:
      return UserRole.EDITOR;
    case 3:
    case 4:
    case 5:
      return UserRole.CONTRIBUTOR;
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      return UserRole.PREMIUM;
    default:
      return UserRole.USER;
  }
};

async function main() {
  const amountOfUsers = 50;
  const amountOfCategories = 10;

  const categories: Category[] = [];

  for (let i = 0; i < amountOfCategories; i++) {
    const category = await prisma.category.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      },
    });
    categories.push(category);
  }

  for (let i = 0; i < amountOfUsers; i++) {
    const role = selectUserRole(i % 25);
    if (role === UserRole.CONTRIBUTOR || role === UserRole.EDITOR) {
    }
    const name = faker.name.fullName();
    const user = await prisma.user.create({
      data: {
        name: name,
        role: role,
        email: faker.internet.email(name),
        username: faker.internet.userName(name),
      },
    });
    if (categories.length > 0) {
      const cat1 = categories[
        Math.floor(Math.random() * categories.length)
      ] as Category;
      const cat2 = categories[
        Math.floor(Math.random() * categories.length)
      ] as Category;
      const cat3 = categories[
        Math.floor(Math.random() * categories.length)
      ] as Category;
      await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          slug: faker.lorem.slug(),
          authorId: user.id,
          categories: {
            connect: [{ id: cat1.id }],
          },
        },
      });
      await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          slug: faker.lorem.slug(),
          published: true,
          authorId: user.id,
          categories: {
            connect: [{ id: cat2.id }],
          },
        },
      });
      await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          slug: faker.lorem.slug(),
          published: true,
          authorId: user.id,
          categories: {
            connect: [{ id: cat3.id }],
          },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma
      .$disconnect()
      .then(() => {
        console.log("Done");
      })
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  });
