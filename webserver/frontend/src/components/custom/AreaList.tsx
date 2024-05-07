import { Area } from "@/interfaces";
import { AreaItem } from "@/components";

interface AreaListProps {
  setOpen?: (value: boolean) => void;
  data: Area[];
}

const AreaList = ({ data }: AreaListProps) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((area) => (
        <AreaItem key={area.id} data={area} />
      ))}
      {/* <div
        role="button"
        onClick={() => setOpen(true)}
        className=" relative h-20 bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-65 transition"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-neutral-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div> */}
    </div>
  );
};

export default AreaList;
