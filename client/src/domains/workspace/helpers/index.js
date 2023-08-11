export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export const isProductLocked = (product) => {
  return !isEmpty(product.needed) || product.org_restricted;
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
