import * as NextLink from "next/link";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export default function Link({
  href,
  children,
  className = "",
  padding,
  ...props
}: LinkProps) {
  return (
    <NextLink.default
      href={href}
      className={`rounded bg-transparent text-base font-semibold text-gray-800 hover:text-blue-500 focus:shadow focus:outline-none
      ${className}
      ${padding ? padding : "px-4 py-2"}}`}
      {...props}
    >
      {children}
    </NextLink.default>
  );
}
