import { Separator } from "@/components/ui/separator";
import { Icons } from "@/utils/icon";
import { useEffect, useState } from "react";
import customAxios from "@/utils/customAxios";
import { useParams } from "react-router-dom";
import { Slot } from "@/interfaces";

const SlotDetail = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const [slot, setSlot] = useState<Slot>({
    id: "",
    name: "",
    area: {
      id: "",
      name: "",
      slot: 0,
      floors: 0,
      price: 0,
    },
    parking: null,
    status: "available",
  });

  useEffect(() => {
    const getSlot = async () => {
      try {
        const response = await customAxios.get(`/slot/${slotId}`);
        if (response.data.status === "success") {
          setSlot(response.data.slot);
        }
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };

    getSlot();
  }, [slotId]);

  console.log(slot);

  return (
    <div className="w-full">
      <div className="flex items-center gap-x-4">
        <div className="w-14 h-14 relative">
          <Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-xl">{slot?.name}</p>
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground font-medium">
              {slot?.area.name}
            </p>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="px-2 md:px-4 "></div>
    </div>
  );
};

export default SlotDetail;
