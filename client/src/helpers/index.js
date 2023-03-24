import dayjs from "dayjs";

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

export const getValueForCode = (list, code) => {
  return list.find((item) => item.code === code);
};

export const getValueForName = (list, name) => {
  return list.find((item) => item.name === name);
};

export const formatDate = (date) => {
  return dayjs(date).format("DD MMMM YYYY");
};

export const isProductLocked = (product) => {
  return !isEmpty(product.needed) || product.org_restricted;
};

export const hasProductAccess = (product) => {
  let hasAccess = true;
  if (product.status === 403) {
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
  } else if (images && images.table.article) {
    updatedAt = images.table.article.table.updated_at;
  } else {
    updatedAt = "";
  }
  return (
    window.location.origin +
    "/documents/" +
    docNum +
    "/images/article?updated_at=" +
    updatedAt
  );
};
