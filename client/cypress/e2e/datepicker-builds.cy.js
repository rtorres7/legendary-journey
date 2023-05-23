describe("Verify Datepicker on the Mange Products Page Works", () => {
  it("Change the date on the Manage Products Page", () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split("T")[0];

    cy.visit(`http://localhost:8080/${today}/products`);

    cy.url().should("include", today);

    cy.get("button.flex.items-center").eq(-1).click();

    cy.contains(".dp__cell_inner", yesterday.getDate()).click();

    cy.url().should("include", formattedYesterday);

    cy.get("button.flex.items-center span.text-lg").should(
      "contain",
      formattedYesterday
    );
  });
});
