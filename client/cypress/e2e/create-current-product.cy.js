describe("Create a Current Product", () => {
  it("Creating a new Current Product", () => {
    const today = new Date().toISOString().split("T")[0];

    cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-full-access.json' });
    cy.intercept('GET', '/api/alerts/list', { fixture: 'empty-alerts.json' });
    cy.intercept('GET', '/api/special_editions/links', { fixture: 'empty-special-edition-links.json' });
    cy.intercept('GET', '/api/metadata', { fixture: 'metadata.json' });

    cy.intercept('GET', `/api/wires/${today}/getWireByDate`, { fixture: 'current/home-page-products.json' });
    cy.intercept('POST', '/api/articles/processDocument', {
      statusCode: 200,
      body: {
        doc_num: "123456",
        article: {
          id: "123456",
        }
      }
    });
    cy.intercept('GET', `/api/wires/${today}/articles/123456/getDocumentData`, {
      statusCode: 200,
      body: {
        countries: [],
        topics: [],
        coordinators: [],
        non_state_actors: [],
        coauthors: [],
        producing_offices: [],
        dissem_orgs: [],
        attachments: []
      }
    })

    cy.visit(`/${today}/products`);
    cy.contains("New Product").click();
  });
});
