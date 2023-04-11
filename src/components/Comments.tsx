import React, { useState } from "react";

import { api } from "~/utils/api";
import PaginationButtons from "~/components/PaginationButtons";
import Typography from "~/components/Typography";
import Button from "./Button";
import { TextArea } from "./Input";
import Image from "next/image";
import Card from "./Card";
import { SignInButton, useUser } from "@clerk/nextjs";

interface CommentsProps {
  articleId: string;
}

export default function Comments({ articleId }: CommentsProps) {
  const [page, setPage] = useState(0);
  const { user } = useUser();
  const createComment = api.comments.createComment.useMutation();

  const { data, fetchNextPage } = api.comments.getComments.useInfiniteQuery(
    {
      articleId,
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    createComment.mutate(
      {
        articleId,
        content: newComment,
      },
      {
        onSuccess: () => {
          const date = new Date();
          currentPage?.push({
            id: "temp",
            content: newComment,
            articleId,
            authorId: user?.id ?? "",
            createdAt: date,
            updatedAt: date,
            author: {
              id: user?.id ?? "",
              name: user?.fullName ?? "",
              image: user?.profileImageUrl ?? "",
              role: "USER",
              username: "Me",
              slug: "",
              email: user?.emailAddresses.join(" ") ?? "",
              bio: "",
              emailVerified: date,
              phone: "",
            },
          });
        },
      }
    );
  };

  const handleFetchNextPage = () => {
    fetchNextPage()
      .then(() => {
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleFetchPreviousPage = () => {
    if (page === 0) return;
    setPage((prev) => prev - 1);
  };

  const currentPage = data?.pages[page]?.items;
  const nextCursor = data?.pages[page]?.nextCursor;
  return (
    <>
      <Typography as="h2" variant="subheading">
        Comments
      </Typography>
      {user?.id ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Typography>
            <label htmlFor="comment">Add a comment:</label>
          </Typography>
          <TextArea
            id="comment"
            name="comment"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          ></TextArea>
          <Button fullWidth type="submit">
            Post
          </Button>
        </form>
      ) : (
        <Button>
          <SignInButton />
        </Button>
      )}
      <ul>
        {currentPage ? (
          currentPage.map((comment) => (
            <li key={comment.id}>
              <Card className="mb-4">
                <Image
                  src={
                    comment.author.image ?? "/images/png/placeholder-user.png"
                  }
                  alt={(comment.author.username || comment.author.name) ?? ""}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <Typography>
                  {comment.author.username || comment.author.name}
                </Typography>
                <Typography>{comment.content}</Typography>
              </Card>
            </li>
          ))
        ) : (
          <li>
            <Typography>No comments yet.</Typography>
          </li>
        )}
      </ul>
      <div className="flex justify-center">
        <PaginationButtons
          page={page}
          nextCursor={nextCursor}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>
    </>
  );
}
