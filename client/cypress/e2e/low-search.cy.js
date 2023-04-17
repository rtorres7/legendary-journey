describe("Low Side Search", () => {
  beforeEach(() => {
    cy.visit("");
    cy.get("#typeahead_id").type("Zelensky{enter}");
  });

  it("navigate to the right page", () => {
    cy.url().should("include", "/search?text=");
  });

  it("displays search results", () => {
    cy.contains("Inside Zelensky's World");
  });

  it("displays search count", () => {
    cy.contains("Showing 1");
  });
});
