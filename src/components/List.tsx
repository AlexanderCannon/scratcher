interface ListProps {
  children:
    | React.ReactElement<ListItemProps>[]
    | React.ReactElement<ListItemProps>;
  direction?: "row" | "column";
}

interface ListItemProps {
  children: React.ReactNode;
}

export function List({ children, direction }: ListProps) {
  if (direction === "row") {
    return (
      <ul className="p4 flex max-w-3xl flex-row flex-wrap justify-center">
        {children}
      </ul>
    );
  }
  return <ul className="flex flex-col space-y-4">{children}</ul>;
}

export function ListItem({ children }: ListItemProps) {
  return (
    <li className="flex items-center space-x-4 rounded-md bg-white p-4 shadow">
      <div className="flex-grow overflow-hidden ">{children}</div>
    </li>
  );
}
