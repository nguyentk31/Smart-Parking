import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { FormPicker } from "@/components";

interface AreaFormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const AreaFormPopover = ({
  children,
  side = "right",
  align = "center",
  sideOffset = 0,
}: AreaFormPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={window.innerWidth > 1024 ? side : "left"}
        sideOffset={sideOffset}
        className="pt-3 w-72 md:w-[360px] z-999"
      >
        <div className="text-sm font-medium text-center pb-4">Add Location</div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            console.log(data);
          }}
          className="space-y-4"
        >
          <FormPicker />
          <div className="space-y-2">
            <Label htmlFor="area-name">Location Name</Label>
            <Input
              required
              name="area-name"
              type="text"
              id="area-name"
              placeholder="Name"
              className="text-md px-2 py-1 "
            />
          </div>
          <Button className="w-full">Create</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AreaFormPopover;
