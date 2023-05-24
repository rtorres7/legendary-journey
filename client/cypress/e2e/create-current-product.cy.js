describe("Create a Current Product", () => {
  it("Creating a new Current Product", () => {
    const today = new Date().toISOString().split("T")[0];
    cy.visit(`http://localhost:8080/${today}/products`);
    cy.contains("New Product").click();
  });
});
