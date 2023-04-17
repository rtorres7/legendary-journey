describe("Search", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/");
  });

  it("navigate to the right page", () => {
    cy.get("#typeahead_id").type("Zelensky");
    cy.get('#search-container').find('button').first().click();
    cy.url().should("include", "/search?text=");
  });

  it("displays search results", () => {
    cy.get("#typeahead_id").type("Zelensky");
    cy.get('#search-container').find('button').first().click();
    cy.contains("Inside Zelensky's World");
  });

  it("displays search count", () => {
    cy.get("#typeahead_id").type("Zelensky");
    cy.get('#search-container').find('button').first().click();
    cy.contains("Showing 1");
  });

  it("verify open ended search brings back result", () => {
    cy.get('#search-container').find('button').first().click();
    cy.contains("Result 1 of");
  });
});
