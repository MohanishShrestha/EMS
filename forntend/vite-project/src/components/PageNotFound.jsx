import { SentimentDissatisfied as SadFaceIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 font-inter">
      <div className="text-center p-8 sm:p-12 bg-white rounded-3xl shadow-2xl max-w-xl w-full transition-all duration-500 ease-in-out hover:shadow-3xl">
        <SadFaceIcon className="w-40 h-40 mx-auto mb-6 text-indigo-500" />

        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight text-indigo-600/80 mb-2 drop-shadow-lg">
          404
        </h1>

        <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Page Not Found
        </p>

        <p className="text-lg text-gray-500 mb-8">
          Oops! The page you were looking for doesn't exist or has been moved.
          It looks like you've hit a dead end.
        </p>

        
      </div>
    </div>
  );
};

export default PageNotFound;
