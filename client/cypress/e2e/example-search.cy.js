describe("Search", () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-full-access.json' });
    cy.intercept('GET', '/api/alerts/list', { fixture: 'empty-alerts.json' });
    cy.intercept('GET', '/api/special_editions/links', { fixture: 'empty-special-edition-links.json' });
    cy.intercept('GET', '/api/metadata', { fixture: 'metadata.json' });
    cy.intercept('GET', '/api/home/features', {
      statusCode: 200,
      body: {
        featured: [],
        briefs: []
      }
    });
    cy.intercept('GET', '/api/search*', {
      statusCode: 200,
      body: {
        results: [
          {
            title: "Inside Zelensky's World",
            doc_num: "123456"
          }
        ],
        totalCount: 1
      }
    })

    cy.visit("http://localhost:8080/");
    cy.get("#typeahead_id").type("Zelensky{enter}");
  });

  it("navigate to the right page", () => {
    cy.url().should("include", "/search?text=Zelensky");
  });

  it("displays search results", () => {
    cy.contains("Inside Zelensky's World");
  });
});
