interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="w-full max-w-[1920px] z-99 mx-auto xl:px-20 md:px-10 px-4 pt-2 pb-8 space-y-4">
      {children}
    </div>
  );
};

export default Container;
