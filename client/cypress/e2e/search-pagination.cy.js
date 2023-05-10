describe("Search Pagination", () => {
  it("Verify Pagination Bug", () => {
    cy.visit("/");
    cy.get("#typeahead_id").type("Zelensky{enter}");
    cy.url().should("include", "text=Zelensky");
    cy.url().then((url) => {
      const newUrl = url.replace("per_page=10", "per_page=50");
      cy.visit(newUrl);
      cy.url().should("include", "per_page=50");
      cy.contains("Showing 1 to 50");
      cy.get("nav")
        .eq(1)
        .find("li")
        .then(($lis) => {
          const lastPageButton = $lis.eq(-2).find("div").first();
          lastPageButton.click();
          cy.url().then((url) => {
            const lastPage = Number($lis.eq(-2).find("div").text());
            const newPage = lastPage + 20;
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("page", newPage);
            const newUrlWithPage = `${window.location.origin}${window.location.pathname}?${searchParams}`;
            cy.visit(newUrlWithPage);
            cy.url().should("include", `page=${newPage}`);
            cy.contains("Sorry, we didn't find any results.");
          });
        });
    });
  });
});
