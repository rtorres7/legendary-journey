export const user = {
  id: 50,
  notifications: {
    ntk: {},
  },
  authorizations: {
    canManageWire: true,
    canManageSpecialEditions: true,
  },
  name: "Jonathan Oszczakiewicz",
  email: "jonathan@gmail.com",
  //roles: ["ntk", "role_manager", "wire_editor", "community_editor"],
  roles: ["ntk", "role_manager", "community_editor"],
  has_org: true,
  organization: "DNI",
  phone_number: "999-9999",
  dn: "Sample DN",
};

export { articles } from "./articles";
export { danielArticles, articlesForWire } from "./danielArticles";
export { countries, regions } from "./regions";
export { getSitreps, getSearchDataFromUrl } from "./search";
export { danielArticlesDetails } from "./danielArticlesDetails";
export { metadata } from "./metadata";
export { specialEdition, specialEditionLinks } from "./specialEditions";
export { relatedProducts } from "./relatedProducts";
export { articleMetrics } from "./articleMetrics";
export { document } from "./document";
export { dissemOrgs } from "./formMetadata";
