import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export class UploadableFile {
  constructor(file) {
    this.file = file;
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.url = URL.createObjectURL(file);
    this.status = null;
    this.dbId = null;
    this.wire_url = null;
  }
}

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

const isContainer = () => import.meta.env.MODE === "container";

export const getValueForCode = (list, code) => {
  const result = list.find((item) => item.code === code);
  if (isContainer) {
    if (!result) {
      console.log("getValueForCode:  code not found in list", code, list);
    }
  }
  return result;
};

export const getValueForName = (list, name) => {
  const result = list.find((item) => item.name === name);
  if (isContainer) {
    if (!result) {
      console.log("getValueForName:  name not found in list", name, list);
    }
  }
  return result;
};

export const formatDate = (date) => {
  return dayjs(date).utc().format("DD MMMM YYYY");
};

export const isProductLocked = (product) => {
  return !isEmpty(product.needed) || product.org_restricted;
};

export const isSavedProduct = (product) => {
  return !!product.saved;
};

export const hasProductAccess = (product, organization) => {
  let hasAccess = true;
  if (
    product.status === 403 ||
    (product.org_restricted && !product.needed.orgs.includes(organization))
  ) {
    hasAccess = false;
  }
  return hasAccess;
};

export const hasProductImage = (product) => {
  let hasImage = true;
  if (isEmpty(product.images)) {
    hasImage = false;
  } else {
    if (product.images.table && isEmpty(product.images.table.article)) {
      hasImage = false;
    }
  }
  return hasImage;
};

export const getProductImageUrl = (images, docNum) => {
  let updatedAt;
  if (Array.isArray(images)) {
    updatedAt = images.filter((image) => image.usage == "article")[0]
      .updated_at;
  } else if (images && images.table?.article) {
    updatedAt = images.table.article.table.updated_at;
  } else {
    updatedAt = "";
  }
  return (
    window.location.origin +
    getApiBaseUrl() +
    "/documents/" +
    docNum +
    "/images/article?updated_at=" +
    updatedAt
  );
};

export const getApiBaseUrl = () => {
  return import.meta.env.MODE === "container" ? "/api" : "";
};

export const getRelativeTime = (timestamp) => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = dayjs().diff(timestamp);
  if (elapsed < msPerMinute) {
    return "Just Now";
  } else if (elapsed < msPerHour) {
    return pluralize(Math.floor(elapsed / msPerMinute), "minute") + " ago";
  } else if (elapsed < msPerDay) {
    return pluralize(Math.floor(elapsed / msPerHour), "hour") + " ago";
  } else if (elapsed < msPerWeek) {
    return pluralize(Math.floor(elapsed / msPerDay), "day") + " ago";
  } else if (elapsed < msPerMonth) {
    return pluralize(Math.floor(elapsed / msPerWeek), "week") + " ago";
  } else if (elapsed < msPerYear) {
    return pluralize(Math.floor(elapsed / msPerMonth), "month") + " ago";
  } else {
    return pluralize(Math.floor(elapsed / msPerYear), "year") + "ago";
  }
};

export const pluralize = (count, noun, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;

//Damion's Idea
export const isProduction = () => {
  return window.location.hostname.charAt(0).toLowerCase() === "c";
};
