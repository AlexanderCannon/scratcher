import z from "zod";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { Readable } from "stream";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

cloudinary.config({
  cloud_name: "douqlqjo3",
  api_key: "262728358169943",
  api_secret: "1pLqBmaRECjDmBsdPm5DbyRKtlc",
});

export const imageRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        file: z.any(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("input", input);
      const { file, name } = input;
      const { user } = ctx.session;
      const rawImage = file.toString().split(",")[1];
      const compressedFile = await sharp(Buffer.from(rawImage, "base64"))
        .resize({ width: 400 })
        .webp({ quality: 80 })
        .toBuffer();

      const uploadStream = await cloudinary.uploader.upload_stream(
        {
          public_id: `users/${user.id}/${name}`,
          folder: "users",
          use_filename: true,
          unique_filename: true,
          overwrite: true,
          resource_type: "image",
          access_mode: "public",
        },
        async (error, image) => {
          if (!image || error) throw new Error("Image not uploaded");
          const url = cloudinary.url(image.public_id, {
            secure: true,
            width: 400,
            height: 400,
            crop: "fill",
            format: "webp",
          });
          const result = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              image: url,
            },
          });
          console.log("res", result);
          return result;
        }
      );
      new Readable({
        read() {
          this.push(compressedFile);
          this.push(null);
        },
      }).pipe(uploadStream);
    }),
});
