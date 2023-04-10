export const getFromQuery = (value: string | string[] | undefined) => {
  return typeof value === "string" ? value : value?.[0] ?? "";
};
