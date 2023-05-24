describe("Verify Datepicker on the Manage Products Page Works", () => {
  it("Change the date on the Manage Products Page", () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split("T")[0];
    const specificPath = `/${today}/products`;

    const baseUrl = Cypress.config().baseUrl;
    const url = `${baseUrl}${specificPath}`;

    cy.visit(url);

    cy.url().should("include", today);

    cy.get('div[aria-label="Datepicker input"]')
      .find("button.flex.items-center")
      .click();

    cy.contains(".dp__cell_inner", yesterday.getDate()).click();

    cy.url().should("include", formattedYesterday);

    cy.get('div[aria-label="Datepicker input"]')
      .find("button.flex.items-center span.text-lg")
      .should("contain", formattedYesterday);
  });
});
