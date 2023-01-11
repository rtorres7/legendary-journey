import dayjs from "dayjs";

export function useDate() {
  const formatDate = (date) => {
    return dayjs(date).format("DD MMMM YYYY");
  };

  return {
    formatDate,
  };
}
