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
      title: "Major Announcement 1",
      message:
        "Maecenas eu diam ac diam mattis egestas id at lorem. Quisque pharetra quam in leo mollis, et hendrerit est lacinia. Sed condimentum, nunc vitae ullamcorper interdum, diam erat eleifend mi, lacinia vehicula ipsum ex nec nisl. Nulla nec dui porttitor turpis consequat sagittis.",
      expiresIn: 50964.292772868,
      start_at: "2023-03-10T06:00:00.000-05:00",
      end_at: "2023-12-02T23:59:00.000-04:00",
    },
    {
      id: 2,
      title: "New Release! Current 2.0 is out!",
      message:
        'ed dignissim bibendum leo, ut ullamcorper ligula porta eu. Sed at tristique sem. Donec ut enim eu tellus pretium porta. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque ut elementum ante. Nullam ac urna ex. Maecenas commodo odio id egestas condimentum. Morbi et orci ligula. Aenean sed pharetra leo. Donec lacinia feugiat justo eu cursus. <a href="https://www.google.com/">Click Here to find out more!</a>',
      expiresIn: 50964.292772868,
      start_at: "2023-03-13T06:00:00.000-05:00",
      end_at: "2023-12-14T23:59:00.000-04:00",
    },
  ],
};

export { features, articlesForWire } from "./features";
export { countries, regions } from "./regions";
export { getSitreps, getSearchDataFromUrl } from "./search";
export { productDetails } from "./productDetails";
export { metadata } from "./metadata";
export { specialEdition, specialEditionLinks } from "./specialEditions";
export { relatedProducts } from "./relatedProducts";
export { articleMetrics } from "./articleMetrics";
export { mockDocument } from "./document";
