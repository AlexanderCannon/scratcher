import * as NextLink from "next/link";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export default function Link({ href, children, ...props }: LinkProps) {
  return (
    <NextLink.default
      href={href}
      className="rounded bg-transparent px-4 py-2 text-base font-semibold text-gray-800 hover:bg-gray-100 focus:shadow focus:outline-none"
      {...props}
    >
      {children}
    </NextLink.default>
  );
}
