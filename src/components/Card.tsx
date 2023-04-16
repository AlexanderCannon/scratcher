interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`w-full rounded-lg bg-slate-700 px-6 py-4 shadow ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
}
