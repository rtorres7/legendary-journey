describe("High Side Search", () => {
  beforeEach(() => {
  cy.visit("");
  });

  it("verify open ended search brings back result", () => {
    cy.get("#search-container").find("button").first().click();
    cy.contains("Showing 1");
  });
});
