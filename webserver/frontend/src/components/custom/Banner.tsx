import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { banner1, banner2, banner3 } from "@/assets/banner";

type bannerType = {
  image: string;
  title: string;
  description: string;
};

const banners: bannerType[] = [
  {
    image: banner1,
    title: "banner1",
    description: "description1",
  },
  {
    image: banner2,
    title: "banner2",
    description: "description2",
  },
  {
    image: banner3,
    title: "banner3",
    description: "description3",
  },
];

const Banner = () => {
  return (
    <Carousel
      className="w-full rounded-xl"
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent className="space-x-2">
        {banners.map((banner) => (
          <CarouselItem key={banner.title} className="relative">
            <img
              src={banner.image}
              alt={banner.title}
              className="object-cover w-full h-96 rounded-xl"
            />

            <div className=" absolute top-0 bottom-0 right-0 left-4 bg-gradient-to-t from-black to-transparent rounded-xl" />

            <div className=" absolute inset-0 flex flex-col items-center justify-end mb-12 gap-y-4">
              <h1 className="text-white text-4xl font-bold">{banner.title}</h1>
              <p className="text-white text-lg">{banner.description}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Banner;
