import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full absolute flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          style={{
            backgroundImage:
              'url("https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif")',
          }}
          className="bg-center h-[400px] bg-cover py-5"
        >
          <h1 className="text-center text-7xl">404</h1>
        </div>
        <div className="text-center -mt-[108px]">
          <h3 className="text-3xl">Look like you're lost</h3>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go back home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
