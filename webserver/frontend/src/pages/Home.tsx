import { ContentHome, Banner, Container, CarouselBlog } from "@/components";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Award,
  CreditCard,
  Gift,
  Headset,
  MapPin,
  Sparkles,
  Truck,
  UserPlus,
} from "lucide-react";
import { hero } from "@/assets/banner";

const Home = () => {
  return (
    <Container>
      <Banner />
      <Carousel className="w-full bg-slate-50 dark:bg-slate-900 py-4 rounded-lg shadow-sm ">
        <CarouselContent>
          <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="group flex gap-x-4 items-center justify-center cursor-pointer">
              <Truck className="w-10 h-10 group-hover:scale-105 transition-transform duration-300 ease-in-out" />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Safe And Secure</h3>
                <span>24 hour surveillance</span>
              </div>
            </div>
          </CarouselItem>
          <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="group flex gap-x-4 items-center justify-center cursor-pointer">
              <Gift className="w-10 h-10 group-hover:scale-105 transition-transform duration-300 ease-in-out" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold">Daily Surprise Gift</h3>
                <span>Save up to 50% off</span>
              </div>
            </div>
          </CarouselItem>
          <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="group flex gap-x-4 items-center justify-center cursor-pointer">
              <Headset className="w-10 h-10 group-hover:scale-105 transition-transform duration-300 ease-in-out" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold">Support 24/7</h3>
                <span>Company with customer service</span>
              </div>
            </div>
          </CarouselItem>
          <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="group flex gap-x-4 items-center justify-center cursor-pointer">
              <CreditCard className="w-10 h-10 group-hover:scale-105 transition-transform duration-300 ease-in-out" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold">Secure Payments</h3>
                <span>100% Protected Payments</span>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="flex flex-col lg:flex-row items-center justify-center py-10">
        <div className="flex items-center justify-center rounded-lg">
          <img
            src={hero}
            alt=""
            className="object-cover rounded-lg lg:w-3/4 w-2/3"
          />
        </div>
        <div className="flex flex-col gap-y-4 py-10 px-20 lg:px-0">
          <h2 className="font-bold text-6xl">Welcome to our parking</h2>
          <hr className="w-20 h-1 bg-slate-200 dark:bg-slate-700" />
          <p className="text-gray-500 dark:text-gray-400">
            Many municipalities require a minimum number of parking spaces,
            depending on the floor area in a store or the number of bedrooms in
            an apartment complex. In the US, each state's Department of
            Transportation sets the ratio.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            We provide the best parking service for you. We have the best
            security and the best service for you. We are the best parking
            service in the world.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-100 gap-y-3">
          <MapPin className="w-16 h-16" />
          <h3 className="text-3xl font-bold tracking-wide">1,000+</h3>
          <p className="text-slate-500 dark:text-slate-700 text-lg font-semibold">
            Parking Locations
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-100 gap-y-3">
          <Award className="w-16 h-16" />
          <h3 className="text-3xl font-bold tracking-wide">95%</h3>
          <p className="text-slate-500 dark:text-slate-700 text-lg font-semibold">
            Customer Satisfaction
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-100 gap-y-3">
          <Sparkles className="w-16 h-16" />
          <h3 className="text-3xl font-bold tracking-wide">5</h3>
          <p className="text-slate-500 dark:text-slate-700 text-lg font-semibold">
            Star Rated App
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-100 gap-y-3">
          <UserPlus className="w-16 h-16" />
          <h3 className="text-3xl font-bold tracking-wide">20,000+</h3>
          <p className="text-slate-500 dark:text-slate-700 text-lg font-semibold">
            Monthly Users
          </p>
        </div>
      </div>
      <CarouselBlog />
      <ContentHome />
    </Container>
  );
};

export default Home;
