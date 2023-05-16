describe("Search Pagination", () => {
  it("Pagination Bug when going beyond the last Page", () => {
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

        lastPageButton.trigger("click");

        cy.url().then((url) => {
          const newPage = lastPage + 20;
          cy.visit(url + "&page=" + newPage);
          cy.url().should("include", "page=" + newPage);
          cy.contains("Sorry, we didn't find any results.");
        });
      });
  });
});
