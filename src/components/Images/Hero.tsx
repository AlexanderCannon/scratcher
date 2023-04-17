interface HeroProps {
  image: string;
  children: React.ReactNode;
}

export default function Hero({ image, children }: HeroProps) {
  return (
    <div
      className="h-screen w-screen bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${image})`,
        position: "relative",
      }}
    >
      <div className="absolute left-1/2 top-1/2 z-10 w-11/12 -translate-x-1/2 -translate-y-1/2 transform text-center text-white md:w-2/3">
        {children}
      </div>
    </div>
  );
}
