describe("Search", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/");
    cy.get("#typeahead_id").type("Zelensky{enter}");
  });

  it("navigate to the right page", () => {
    cy.url().should("include", "/search?text=");
  });

  it("displays search results", () => {
    cy.contains("Inside Zelensky's World");
  });
});
