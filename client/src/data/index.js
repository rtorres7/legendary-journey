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
  roles: ["ntk", "role_manager", "wire_editor", "community_editor"],
  //roles: ["ntk", "role_manager", "community_editor"],
  has_org: true,
  organization: "DNI",
  phone_number: "999-9999",
  dn: "Sample DN",
};

export const alerts = {
  alerts: [
    {
      id: 1,
      title: "System Alert 1",
      message: "this is a test message for a first alert",
      expiresIn: 50964.292772868,
      start_at: "2023-03-10T06:00:00.000-05:00",
      end_at: "2023-04-02T23:59:00.000-04:00",
    },
    {
      id: 2,
      title: "System Alert 2",
      message: "this is a test message for a second alert",
      expiresIn: 50964.292772868,
      start_at: "2023-03-13T06:00:00.000-05:00",
      end_at: "2023-04-14T23:59:00.000-04:00",
    },
  ],
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
export { mockDocument } from "./document";
