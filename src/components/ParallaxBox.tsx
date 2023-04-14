import Typography from "./Typography";

interface ParallaxBoxProps {
  image: string;
  children: React.ReactNode;
}

export default function ParallaxBox({ image, children }: ParallaxBoxProps) {
  return (
    <div
      className="h-80 min-h-fit rounded bg-cover bg-fixed bg-bottom bg-no-repeat md:h-tt"
      style={{
        backgroundImage: `url(${image})`,
        position: "relative",
      }}
    >
      <div
        className="absolute inset-0 rounded"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: "1",
        }}
      ></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(10px)",
          zIndex: "-1",
        }}
      ></div>
      <div className="absolute left-1/2 top-1/2 z-10 w-11/12 -translate-x-1/2 -translate-y-1/2 transform text-center text-white md:w-2/3">
        {children}
      </div>
    </div>
  );
}
