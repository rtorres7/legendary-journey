export const user = {
    id: 50,
    notifications: {
        "ntk": {}
    },
    authorizations: {
        canManageSpecialEditions: true
    },
    name: 'Jonathan Oszczakiewicz',
    email: "jonathan@gmail.com",
    roles: [
        "wire_editor",
        "ntk",
        "role_manager"
    ],
    has_org: true,
    organization: "DNI",
    phone_number: "999-9999",
    dn: "Sample DN"
}

export { articles } from './articles'
export { danielArticles, articlesForWire } from './danielArticles'
export { countries, regions } from './regions'
export { getOseFeeds, getKingFisherFeeds, getNicFeeds, getSearchDataFromUrl } from './search'
export { danielArticlesDetails } from "./danielArticlesDetails"
export { metadata } from "./metadata"
export { specialEdition, specialEditionLinks } from "./specialEditions"
export { relatedProducts } from "./relatedProducts"
export { articleMetrics } from "./articleMetrics"
