export const PRIMARY_COLOR = "#012f1f";

export const USER_ROLES = [
  { label: "Customer", value: "customer" },
  { label: "Admin", value: "admin" },
  { label: "Owner", value: "owner" },
];

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
