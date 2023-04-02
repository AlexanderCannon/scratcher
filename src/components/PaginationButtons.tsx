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
  return (
    <div className="w-100 mt-6 flex w-2/3 justify-between">
      <button
        disabled={page === 0}
        onClick={handleFetchPreviousPage}
        className="w-1/2 rounded-l bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <button
        disabled={!nextCursor}
        onClick={handleFetchNextPage}
        className="w-1/2 rounded-r bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
