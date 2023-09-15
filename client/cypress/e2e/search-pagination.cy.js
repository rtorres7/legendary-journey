describe("Search Pagination", () => {
  it("Pagination Bug when going beyond the last Page", () => {
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
    cy.intercept('GET', '/api/search?text=Zelensky&per_page=10', { fixture: 'current/search-with-single-zelensky-result.json' });
    cy.intercept('GET', '/api/search?text=Zelensky&per_page=50', { fixture: 'current/search-with-single-zelensky-result.json' });
    cy.intercept('GET', '/api/search?text=Zelensky&per_page=50&page=29', {
      statusCode: 200,
      body: {
        results: [],
        pages: 9,
        totalCount: 421
      }
    });

    cy.visit("/");
    cy.get("#typeahead_id").type("Zelensky{enter}");
    cy.url().should("include", "text=Zelensky");

    cy.url().then((url) => {
      const newUrl = url.replace("per_page=10", "per_page=50");
      cy.visit(newUrl);
    });

    cy.url().should("include", "per_page=50");
    cy.contains("Showing 1 to 50");

    cy.get("nav")
      .eq(1)
      .find("li")
      .then(($lis) => {
        const lastPageButton = $lis.eq(-2).find("div").first();
        const lastPage = Number(lastPageButton.text());

        // lastPageButton.trigger("click");

        cy.url().then((url) => {
          const newPage = lastPage + 20;
          cy.visit(url + "&page=" + newPage);
          cy.url().should("include", "page=" + newPage);
          cy.contains("Sorry, we didn't find any results.");
        });
      });
  });
});
