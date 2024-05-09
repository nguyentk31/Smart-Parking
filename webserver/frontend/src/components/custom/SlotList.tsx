import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bike,
  Car,
  RectangleHorizontal,
  // Trash2,
  Truck,
} from "lucide-react";
import { CarSlotList } from "@/components";
// import { Button } from "@/components/ui/button";
import { Slot } from "@/interfaces";
// import customAxios from "@/utils/customAxios";
// import { toast } from "react-toastify";
// import { useNavigate, NavigateFunction } from "react-router-dom";

interface SlotListProps {
  carData: Slot[];
}

const SlotList = ({ carData }: SlotListProps) => {
  // const navigate: NavigateFunction = useNavigate();

  // const handleDeleteArea = async () => {
  //   try {
  //     const response = await customAxios.delete(`/area/${carData[0].area.id}`);
  //     if (response.data.status === "success") {
  //       toast.success(response.data.message);
  //       navigate("/admin/allotment/");
  //     }
  //   } catch (error: any) {
  //     toast.error(error.response.data.message);
  //   }
  // };
  return (
    <Tabs defaultValue="cars" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="cars">
            <Car className="w-6 h-6 mr-2" />
            Cars
          </TabsTrigger>
          <TabsTrigger value="bikes" disabled>
            <Bike className="w-6 h-6 mr-2" />
            Bikes
          </TabsTrigger>
          <TabsTrigger value="trucks" disabled>
            <Truck className="w-6 h-6 mr-2" />
            Trucks
          </TabsTrigger>
        </TabsList>
        {/* <Button
          onClick={handleDeleteArea}
          variant={"destructive"}
          size={"icon"}
          className="flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5" />
        </Button> */}
      </div>
      <TabsContent value="cars">
        <div className="grid grid-cols-5 gap-x-5 ">
          <div className="col-span-1 shadow-sm shadow-slate-200 dark:shadow-slate-800">
            {Array.from({ length: carData[0]?.area?.floors }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 lg:gap-x-2 rounded-sm py-1.5 px-4 font-medium  hover:bg-neutral-500/10 duration-75 ease-in-out cursor-pointer"
                >
                  <RectangleHorizontal className="w-6 h-6" />
                  <p className="text-base font-semibold flex items-center gap-x-2">
                    <span className="hidden md:block">Floor</span> {index + 1}
                  </p>
                </div>
              )
            )}
          </div>
          <div className=" col-span-4 overflow-x-auto">
            <CarSlotList data={carData} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SlotList;
