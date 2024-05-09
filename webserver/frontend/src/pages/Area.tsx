import { Icons } from "@/utils/icon";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Area } from "@/interfaces";
import customAxios from "@/utils/customAxios";
import {
  AreaList,
  //  CustomModal
} from "@/components";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";

const AreaPage = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  // const [open, setOpen] = useState<boolean>(false);

  // const handleCreateArea = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const areaName = formData.get("areaName");
  //   const areaSlot = formData.get("areaSlot");
  //   const areaFloors = formData.get("areaFloors");
  //   const areaPrice = formData.get("areaPrice");
  //   try {
  //     const response = await customAxios.post("/area/", {
  //       name: areaName,
  //       slot: areaSlot,
  //       floors: areaFloors,
  //       price: areaPrice,
  //     });
  //     if (response.data.status === "success") {
  //       setOpen(false);
  //       setAreas((prev) => [...prev, response.data.area]);
  //       toast.success(response.data.message);
  //     }
  //   } catch (error: any) {
  //     toast.error(error.response.data.message);
  //   }
  // };

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await customAxios.get("/area/");
        if (response.data.status === "success") {
          setAreas(response.data.areas);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAreas();
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-x-4">
          <div className="w-14 h-14 relative">
            <Icons.logo className="w-full h-full rounded-md  bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xl">Area</p>
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground font-medium">
                {areas.length} areas
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="px-2 md:px-4">
          <AreaList data={areas} />
        </div>
      </div>
      {/* <CustomModal open={open} onClose={() => setOpen(false)}>
        <div className="w-full">
          <h2 className="text-2xl font-semibold tracking-wider">Create Area</h2>
          <hr className="my-3" />
          <form className="space-y-4" onSubmit={handleCreateArea}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Name"
                required
                name="areaName"
                className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center justify-between gap-x-10">
              <div className="space-y-2">
                <Label htmlFor="slot">Slot</Label>
                <Input
                  type="number"
                  id="slot"
                  required
                  placeholder="Slot"
                  name="areaSlot"
                  className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floors">Floors</Label>
                <Input
                  type="number"
                  required
                  id="floors"
                  name="areaFloors"
                  placeholder="Floors"
                  className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price
                  <span className="text-muted-foreground"> /hours</span>
                </Label>
                <Input
                  type="number"
                  required
                  id="price"
                  name="areaPrice"
                  placeholder="Price"
                  className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </div>
      </CustomModal> */}
    </>
  );
};

export default AreaPage;
