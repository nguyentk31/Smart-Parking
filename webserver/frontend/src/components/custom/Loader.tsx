import { Icons } from "@/utils/icon";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen z-999">
      <Icons.spinner className="animate-spin w-12 h-12 " />
    </div>
  );
};

export default Loader;
