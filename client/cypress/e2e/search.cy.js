describe("High Side Search", () => {
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
        totalCount: 50
      }
    })
    cy.visit("");
  });

  it("verify open ended search brings back result", () => {
    cy.get("#search-container").find("button").first().click();
    cy.contains("Showing 1");
  });
});
