import next from "next/types";

interface ButtonSetProps {
  page: number;
  handleFetchNextPage: () => void;
  handleFetchPreviousPage: () => void;
  nextCursor: string | undefined;
}

export default function ButtonSet({
  page,
  handleFetchNextPage,
  handleFetchPreviousPage,
  nextCursor,
}: ButtonSetProps) {
  const handleNextClick = () => {
    if (nextCursor) handleFetchNextPage();
  };
  const handlePreviousClick = () => {
    if (page > 0) handleFetchPreviousPage();
  };
  return (
    <div className="mt-6 flex w-2/3 w-full justify-between">
      <button
        disabled={page === 0}
        onClick={handlePreviousClick}
        className="w-1/2 rounded-l-full bg-blue-500  px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <span className="w-1"></span>
      <button
        disabled={!nextCursor}
        onClick={handleNextClick}
        className="w-1/2 rounded-r-full bg-blue-500  px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
