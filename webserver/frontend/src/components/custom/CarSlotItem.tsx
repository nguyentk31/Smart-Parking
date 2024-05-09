import { frontCar, backCar, leftCar, rightCar } from "@/assets/car";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { Button } from "../ui/button";
import { Slot } from "@/interfaces";
import { useLayoutEffect, useState } from "react";

interface CarSlotItemProps {
  data: Slot;
  direction: "front" | "back" | "right" | "left";
}

const CarSlotItem = ({ data, direction }: CarSlotItemProps) => {
  const [carDirection, setCarDirection] = useState<string>(frontCar);
  const [size, setSize] = useState<string>("w-[85px] h-[65px]");
  const navigate: NavigateFunction = useNavigate();

  useLayoutEffect(() => {
    switch (direction) {
      case "front":
        setCarDirection(frontCar);
        setSize("w-[85px] h-[65px]");
        break;
      case "back":
        setCarDirection(backCar);
        setSize("w-[85px] h-[65px]");
        break;
      case "left":
        setCarDirection(leftCar);
        setSize("w-[65px] h-[85px]");
        break;
      case "right":
        setCarDirection(rightCar);
        setSize("w-[65px] h-[85px]");
        break;
      default:
        break;
    }
  }, [direction]);
  return (
    <Button
      variant={"ghost"}
      onClick={() => navigate(`slot/${data?.id}`)}
      disabled
      className={`flex p-0 items-center justify-center ${size} rounded-lg bg-gray-200 hover:bg-gray-300 ${
        data?.status === "unavailable" ? "disabled:opacity-70" : ""
      }`}
    >
      {data?.status === "unavailable" ? (
        <img src={carDirection} width={80} alt="" />
      ) : (
        <p
          className={`${
            data?.status === "available"
              ? "text-gray-500"
              : "text-gray-200 dark:text-gray-700"
          }`}
        >
          {data?.name}
        </p>
      )}
    </Button>
  );
};

export default CarSlotItem;

// ${
//   data?.status === "booked"
//     ? "bg-emerald-400 hover:bg-emerald-500"
//     : "bg-gray-200 hover:bg-gray-300 "
// }
