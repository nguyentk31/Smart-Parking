import { Link } from "react-router-dom";

interface AreaItemProps {
  id: string;
  name: string;
  image: string;
}

const AreaItem = ({ id, name, image }: AreaItemProps) => {
  return (
    <Link
      to={`${id}`}
      className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-600 rounded-sm h-full w-full p-2 overflow-hidden"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition ">
        <p className="relative font-semibold text-white m-3">{name}</p>
      </div>
    </Link>
  );
};

export default AreaItem;
