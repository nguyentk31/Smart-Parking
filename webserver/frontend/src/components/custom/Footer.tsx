import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Send } from "lucide-react";
import { Input } from "../ui/input";

const Footer = () => {
  const SITEMAP = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Our Team", "Projects"],
    },
    {
      title: "Help Center",
      links: ["Discord", "Twitter", "GitHub", "Contact Us"],
    },
    {
      title: "Resources",
      links: ["Blog", "Newsletter", "Free Products", "Affiliate Program"],
    },
    {
      title: "Products",
      links: ["Phones", "Laptops", "Desktops", "Accessories"],
    },
  ];
  return (
    <footer className="relative w-full bg-slate-800 dark:bg-slate-900 text-white pt-4 pb-2">
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 px-8 md:px-16 xl:px-32 py-4 border-b border-gray-700">
        <div className="flex items-center gap-x-4">
          <Send className="w-8 h-8" />
          <h1 className="text-2xl font-semibold">Sign up for our newsletter</h1>
        </div>
        <div className="flex flex-grow items-center p-1 bg-slate-50 text-gray-800 rounded-lg md:max-w-[700px] w-4/5 lg:w-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none dark:bg-slate-50"
          />
          <Button className="dark:bg-slate-900 dark:text-slate-50">
            Subscribe
          </Button>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-6 pt-2 ">
        <div className="grid sm:gap-x-16 sm:grid-cols-2 lg:grid-cols-4 w-full gap-y-8 mx-auto grid-cols-1 py-4">
          {SITEMAP.map(({ title, links }, key) => (
            <FooterList key={key} title={title}>
              {links.map((link, key) => (
                <Link
                  key={key}
                  to="#"
                  className="hover:text-slate-500 font-medium  tracking-wider"
                >
                  {link}
                </Link>
              ))}
            </FooterList>
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-center border-t border-gray-700 py-2 md:flex-row md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Demo App, Inc. All rights
            reserved.
          </p>
          <div className="flex gap-4 sm:justify-center">
            <LinkButton to="#">
              <FaFacebook className="h-5 w-5" />
            </LinkButton>
            <LinkButton to="#">
              <FaInstagram className="h-5 w-5" />
            </LinkButton>
            <LinkButton to="#">
              <FaTwitter className="h-5 w-5" />
            </LinkButton>
            <LinkButton to="#">
              <FaYoutube className="h-5 w-5" />
            </LinkButton>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

interface FooterListProps {
  title: string;
  children: React.ReactNode;
}

const FooterList = ({ title, children }: FooterListProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-center sm:items-start ">
      <h3 className="text-lg font-semibold uppercase tracking-widest">
        {title}
      </h3>
      {children}
    </div>
  );
};

interface LinkButtonProps {
  to: string;
  children: React.ReactNode;
}

const LinkButton = ({ to, children }: LinkButtonProps) => {
  return (
    <Link to={to}>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="rounded-full transition duration-300 "
      >
        {children}
      </Button>
    </Link>
  );
};
