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
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">{children}</ul>
    );
  }
  return <ul className="flex flex-col space-y-4">{children}</ul>;
}

export function ListItem({ children }: ListItemProps) {
  return (
    <li className="align-center mb-6 flex items-center space-x-4 rounded-md bg-white p-4 shadow">
      <div className="flex flex-grow flex-col items-center overflow-hidden">
        {children}
      </div>
    </li>
  );
}
