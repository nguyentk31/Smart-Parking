import { LocationFormPopover, LocationItem } from "@/components";
import { Location } from "@/interfaces";

interface AreaListProps {
  data: Location[];
}

const AreaList = ({ data }: AreaListProps) => {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((area) => (
          <LocationItem
            key={area.id}
            id={area.id}
            name={area.name}
            image={area.image}
          />
        ))}

        <LocationFormPopover sideOffset={10}>
          <div
            role="button"
            className="aspect-video relative h-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-65 transition"
          >
            <p className="text-base font-semibold">Add new location</p>
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
          </div>
        </LocationFormPopover>
      </div>
    </div>
  );
};

export default AreaList;
