import { Separator } from "@/components/ui/separator";
import { Icons } from "@/utils/icon";
import { useEffect, useState } from "react";
import customAxios from "@/utils/customAxios";
import { useParams } from "react-router-dom";
import { Area, Slot } from "@/interfaces";
import { SlotList } from "@/components";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";

interface SlotPageProps {
  socket: Socket;
}

const SlotPage = ({ socket }: SlotPageProps) => {
  const [area, setArea] = useState<Area>({
    id: "",
    name: "",
    slot: 0,
    floors: 0,
    price: 0,
  });
  const { areaId } = useParams<{ areaId: string }>();
  const [data, setData] = useState<Slot[]>([]);

  useEffect(() => {
    const gethArea = async () => {
      try {
        const response = await customAxios.get(`/area/${areaId}`);
        if (response.data.status === "success") {
          setArea(response.data.area);
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };

    const getSlots = async () => {
      try {
        const sortAlphaNum = (a: string, b: string) =>
          a.localeCompare(b, "en", { numeric: true });
        const response = await customAxios.get(`/slot/area/${areaId}`);
        if (response.data.status === "success") {
          setData(
            response.data.slots.sort((a: Slot, b: Slot) =>
              sortAlphaNum(a.name, b.name)
            )
          );
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };

    getSlots();
    gethArea();
  }, [areaId]);

  useEffect(() => {
    const sortAlphaNum = (a: string, b: string) =>
      a.localeCompare(b, "en", { numeric: true });
    socket.on("receiveSlot", (data: Slot[]) => {
      setData(data.sort((a: Slot, b: Slot) => sortAlphaNum(a.name, b.name)));
    });

    return () => {
      socket.off("receiveSlot");
    };
  }, [socket]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-x-4">
        <div className="w-14 h-14 relative">
          <Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-xl">
            {area?.name} - Thủ Đức, Hồ Chí Minh
          </p>
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground font-medium">
              {area?.slot} slots
            </p>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="px-2 md:px-4 ">
        <SlotList carData={data} />
      </div>
    </div>
  );
};

export default SlotPage;
