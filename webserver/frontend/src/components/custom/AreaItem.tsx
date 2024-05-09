import { Area } from "@/interfaces";
import { LandPlot, Layers } from "lucide-react";
import { Link } from "react-router-dom";

interface AreaItemProps {
  data: Area;
}

const AreaItem = ({ data }: AreaItemProps) => {
  return (
    <Link
      to={`area/${data.id}`}
      className="bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-y-2 cursor-pointer hover:opacity-70 transition duration-300 ease-in-out px-4 py-2 h-20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <LandPlot className="w-5 h-5 text-slate-700 dark:text-slate-400" />
          <p className="text-lg font-semibold">{data.name}</p>
        </div>
        <div className="flex items-center gap-x-1">
          <Layers className="w-5 h-5 text-slate-700 dark:text-slate-400" />
          <p className="text-sm font-medium">{data.floors}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-x-2">
        <p className="text-sm font-medium text-muted-foreground">
          {data.slot} slots
        </p>

        <p className="text-base font-semibold">
          ${data.price}{" "}
          <span className="text-sm text-muted-foreground">/ month</span>
        </p>
      </div>
    </Link>
  );
};

export default AreaItem;
