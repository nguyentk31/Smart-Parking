import { Separator } from "@/components/ui/separator";
import { CarSlotItem } from "@/components";
import { Slot } from "@/interfaces";
import { useLayoutEffect, useState } from "react";
interface CarSlotListProps {
  data: Slot[];
}

const CarSlotList = ({ data }: CarSlotListProps) => {
  const [typeSlot, setTypeSlot] = useState<number>(1);

  useLayoutEffect(() => {
    switch (data.length) {
      case 32:
        setTypeSlot(1);
        break;
      case 40:
        setTypeSlot(2);
        break;
      default:
        setTypeSlot(1);
        break;
    }
  }, [data.length]);

  return (
    <div className="w-full">
      {typeSlot === 1 ? (
        <CarSlotType1 data={data} />
      ) : (
        <CarSlotType2 data={data} />
      )}
    </div>
  );
};

export default CarSlotList;

const CarSlotType1 = ({ data }: { data: Slot[] }) => {
  return (
    <div className="space-y-20">
      <div className="flex justify-center">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="flex items-center">
            <Separator orientation="vertical" />
            <div className="flex flex-col w-[68px] items-center">
              <Separator />
              <CarSlotItem data={data[index]} direction="right" />
            </div>
            <Separator orientation="vertical" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-evenly">
        <div>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index}>
              <Separator />
              <div className="flex h-[68px] items-center gap-x-1">
                <CarSlotItem data={data[index + 10]} direction="front" />
                <Separator orientation="vertical" />
                <CarSlotItem data={data[index + 10 + 3]} direction="back" />
              </div>
            </div>
          ))}
          <Separator />
        </div>
        <div>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index}>
              <Separator />
              <div className="flex h-[68px] items-center gap-x-1">
                <CarSlotItem data={data[index + 16]} direction="front" />
                <Separator orientation="vertical" />
                <CarSlotItem data={data[index + 16 + 3]} direction="back" />
              </div>
            </div>
          ))}
          <Separator />
        </div>
      </div>
      <div className="flex justify-center">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="flex items-center">
            <Separator orientation="vertical" />
            <div className="flex flex-col w-[68px] items-center">
              <CarSlotItem data={data[index + 22]} direction="right" />
              <Separator />
            </div>
            <Separator orientation="vertical" />
          </div>
        ))}
      </div>
    </div>
  );
};

const CarSlotType2 = ({ data }: { data: Slot[] }) => {
  return (
    <div className="space-y-20">
      <div className="flex justify-center">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="flex items-center">
            <Separator orientation="vertical" />
            <div className="flex flex-col w-[68px] items-center">
              <Separator />
              <CarSlotItem data={data[index]} direction="right" />
            </div>
            <Separator orientation="vertical" />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="flex items-center">
            <Separator orientation="vertical" />
            <div className="flex flex-col w-[68px] items-center">
              <CarSlotItem data={data[index + 10]} direction="right" />
              <Separator />
              <CarSlotItem data={data[index + 20]} direction="right" />
            </div>
            <Separator orientation="vertical" />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="flex items-center">
            <Separator orientation="vertical" />
            <div className="flex flex-col w-[68px] items-center">
              <CarSlotItem data={data[index + 30]} direction="right" />
              <Separator />
            </div>
            <Separator orientation="vertical" />
          </div>
        ))}
      </div>
    </div>
  );
};
