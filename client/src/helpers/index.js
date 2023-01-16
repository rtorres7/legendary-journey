import dayjs from "dayjs";

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
export const getValueForCode = (list, code) => {
  return list.find((item) => item.code === code);
};
export const getValueForName = (list, name) => {
  return list.find((item) => item.name === name);
};

export const transformWireUrl = (wireDoc) => {
  //regex to block WIRe prefix should go here
  return wireDoc;
};

export const formatDate = (date) => {
  return dayjs(date).format("DD MMMM YYYY");
};
