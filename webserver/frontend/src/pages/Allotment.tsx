import { Icons } from "@/utils/icon";
import { Separator } from "@/components/ui/separator";
import { LocationList } from "@/components";
import { useState } from "react";
import { Location } from "@/interfaces";

const locations: Location[] = [
  {
    id: "1",
    name: "Thủ Đức, Hồ Chí Minh",
    image:
      "https://images.pexels.com/photos/12741813/pexels-photo-12741813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const Allotment = () => {
  const [location] = useState<Location[]>(locations);

  return (
    <div className="w-full">
      <div className="flex items-center gap-x-4">
        <div className="w-14 h-14 relative">
          <Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-xl">Location</p>
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground font-medium">
              {location.length} location
            </p>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <LocationList data={location} />
      </div>
    </div>
  );
};

export default Allotment;
