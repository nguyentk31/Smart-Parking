import { truncateText } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogCardProps {
  blog: any;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 ">
      <div className="flex justify-between items-center mb-5 text-gray-500">
        <span className="text-base tracking-wider">
          <time>{blog.date}</time>
        </span>
      </div>
      <div className="flex flex-col justify-between h-[200px]">
        <div className="space-y-2">
          <Link to={"#"} className="text-2xl font-bold tracking-wide ">
            {truncateText(blog.title, 25)}
          </Link>
          <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
            {truncateText(blog.content, 200)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={blog.avatar} alt="Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="font-medium dark:text-white">{blog.name}</span>
          </div>
          <Button variant={"outline"}>Read More</Button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
