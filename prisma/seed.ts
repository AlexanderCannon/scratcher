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

function generateUniqueNouns(amount: number): string[] {
  const uniqueNouns = new Set();
  while (uniqueNouns.size < amount) {
    const noun = faker.random.word();
    uniqueNouns.add(noun);
  }
  return Array.from(uniqueNouns) as unknown as string[];
}

async function main() {
  const amountOfUsers = 100;
  const amountOfCategories = 30;

  const categoriesList = generateUniqueNouns(amountOfCategories);
  const categoryPromises = categoriesList.map(async (name) => {
    const category = await prisma.category.create({
      data: {
        name: name,
        description: faker.lorem.sentence(),
        slug: name
          .toLocaleLowerCase()
          .replaceAll(" ", "-")
          .replaceAll(/[\;\,\/\?\:\@\&\=\+\$\_\.!\~\*\'\(\)\#]/g, ""),
      },
    });
    return category;
  });

  const categories = await Promise.all(categoryPromises);
  const userIds = [] as string[];
  for (let i = 0; i < amountOfUsers; i++) {
    const role = selectUserRole(i % 25);
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const name = `${firstName} ${lastName}`;
    const user = await prisma.user.create({
      data: {
        name: name,
        role: role,
        email: faker.internet.email(),
        username: faker.internet.userName(firstName, lastName),
        slug: name
          .toLocaleLowerCase()
          .replaceAll(" ", "-")
          .replaceAll(/[\;\,\/\?\:\@\&\=\+\$\_\.!\~\*\'\(\)\#]/g, ""),
        emailVerified: new Date(),
        bio: faker.lorem.sentence(),
      },
    });
    userIds.push(user.id);
    if (
      (categories.length > 0 && role === "CONTRIBUTOR") ||
      role === "EDITOR"
    ) {
      const cat1 = categories[
        Math.floor(Math.random() * categories.length)
      ] as Category;
      const cat2 = categories[
        Math.floor(Math.random() * categories.length)
      ] as Category;
      const cat3 = categories[
        Math.floor(Math.random() * categories.length)
      ] as Category;
      const articleOneContent = faker.lorem.paragraphs(8, "\n\n");
      const articleTwoContent = faker.lorem.paragraphs(8, "\n\n");
      const articleThreeContent = faker.lorem.paragraphs(8, "\n\n");

      await prisma.article.create({
        data: {
          title: faker.lorem.sentence(),
          content: articleOneContent,
          intro: articleOneContent.substring(0, 190),
          slug: faker.lorem.slug(),
          authorId: user.id,
          categories: {
            connect: [{ id: cat1.id }],
          },
        },
      });
      await prisma.article.create({
        data: {
          title: faker.lorem.sentence(),
          content: articleTwoContent,
          intro: articleTwoContent.substring(0, 190),
          slug: faker.lorem.slug(),
          published: true,
          authorId: user.id,
          image: faker.image.imageUrl(1200, 600),
          categories: {
            connect: [{ id: cat2.id }],
          },
        },
      });
      const withComments = await prisma.article.create({
        data: {
          title: faker.lorem.sentence(),
          content: articleThreeContent,
          intro: articleThreeContent.substring(0, 190),
          slug: faker.lorem.slug(),
          published: true,
          image: faker.image.imageUrl(1200, 600),
          authorId: user.id,
          categories: {
            connect: [{ id: cat3.id }],
          },
        },
      });
      await prisma.comment.createMany({
        data: [
          {
            content: faker.lorem.sentence(),
            authorId: userIds[
              Math.floor(Math.random() * userIds.length)
            ] as string,
            articleId: withComments.id,
          },
          {
            content: faker.lorem.sentence(),
            authorId: userIds[
              Math.floor(Math.random() * userIds.length)
            ] as string,
            articleId: withComments.id,
          },
          {
            content: faker.lorem.sentence(),
            authorId: userIds[
              Math.floor(Math.random() * userIds.length)
            ] as string,
            articleId: withComments.id,
          },
        ],
      });
    }
  }
  for (const id of userIds) {
    await prisma.follow.createMany({
      data: [
        {
          followerId: id,
          followingId: userIds[
            Math.floor(Math.random() * userIds.length)
          ] as string,
        },
        {
          followerId: id,
          followingId: userIds[
            Math.floor(Math.random() * userIds.length)
          ] as string,
        },
        {
          followerId: id,
          followingId: userIds[
            Math.floor(Math.random() * userIds.length)
          ] as string,
        },
      ],
    });
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
