import Typography from "./Typography";
const Loading = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="relative">
        <div className="flex items-center justify-center">
          <div className="mr-1 h-4 w-4 rounded-full bg-blue-500"></div>
          <div className="mr-1 h-4 w-4 rounded-full bg-blue-500"></div>
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
        </div>
        <div className="absolute left-0 top-0 ml-1 mt-1">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        </div>
        <div className="absolute right-0 top-0 mr-1 mt-1">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        </div>
        <div className="absolute bottom-0 left-0 mb-1 ml-1">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        </div>
        <div className="absolute bottom-0 right-0 mb-1 mr-1">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        </div>
      </div>
      <Typography className="mt-4 text-gray-500">Loading...</Typography>
    </div>
  );
};

export default Loading;
