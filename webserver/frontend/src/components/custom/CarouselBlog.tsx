import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components";

type Blog = {
  name: string;
  avatar: string;
  title: string;
  content: string;
  date: string;
};

const data: Blog[] = [
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits",
    title: " Beautiful Sunday Morning Renaissance",
    content:
      "You’re only as good as your last collection, which is an enormous pressure. I think there is something about luxury – it’s not something people need, but it’s what they want. It really pulls at their heart.I have my favourite fashion decade, yes, yes, yes: ’60s. It was a sort of little revolution; the clothes were amazing but not too exaggerated.",
    date: "October 20, 2023",
  },
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits",
    title: "Sed Ut Perspiciatis Unde Omnis Renaissance ",
    content:
      "To enjoy alternately the sight of their distress. He really shouted with pleasure; and, shaking Monsieur Du Bois strenuously by the hand, wished him joy of having touched English ground.",
    date: "September 22, 2023",
  },
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits",
    title: "Vitae Magnis Fusce Laoreet Porttitor Hampden",
    content:
      "I have my favourite fashion decade, yes, yes, yes: ’60s. It was a sort of little revolution; the clothes were amazing but not too exaggerated.",
    date: "April 14, 2023",
  },
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits",
    title: "Urna Pretium Elit Mauris Cursus Curabitu",
    content:
      "The only thing I like better than talking about food is eating. I am not a chef. I’m not even a trained or professional cook. My qualification is as an eater.",
    date: "January 15, 2024",
  },
];

const CarouselBlog = () => {
  return (
    <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-8 rounded-md">
      <div className="mx-auto max-w-screen-sm text-center">
        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Our Blog
        </h2>
        <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
          We use an agile approach to test assumptions and connect with the
          needs of your audience early and often.
        </p>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-3xl">Our Latest News</h3>
        <Button variant={"outline"}>
          SEE ALL <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
      <Carousel className="w-full">
        <CarouselContent>
          {data.map((blog, index) => (
            <CarouselItem key={index} className=" md:basis-1/2 xl:basis-1/3">
              <BlogCard blog={blog} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CarouselBlog;
