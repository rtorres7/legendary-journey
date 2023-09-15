describe("Loading App", () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/alerts/list', { fixture: 'empty-alerts.json' });
    cy.intercept('GET', '/api/special_editions/links', { fixture: 'empty-special-edition-links.json' });
    cy.intercept('GET', '/api/metadata', { fixture: 'metadata.json' });
    cy.intercept('GET', '/api/home/features', { fixture: 'current/empty-home-features.json' });
  });

  describe("Using complicated tailwind css selectors", () => {
    describe("User with full access", () => {
      it("should have the full menu options", () => {
        cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-full-access.json' });
        cy.visit("/");

        cy.get('nav .space-x-2 button.max-w-xs').then($adminMenu => {
          if ($adminMenu.length > 0 && $adminMenu.is(':visible')) {
            cy.get('nav .space-x-2 button.max-w-xs').click();
            cy.contains('body', 'Manage Products');
            cy.contains('body', 'Manage Special Editions');
          } else {
            cy.get('nav .space-x-2 > button').then($userMenu => {
              if ($userMenu.length > 0 && $userMenu.is(':visible')) {
                cy.get('nav .space-x-2 > button').click();
                cy.contains('body', 'Manage Products');
                cy.contains('body', 'Manage Special Editions');
              }
            })
          }
        });
      });
    });

    describe("User with manage product access", () => {
      it("should have the manage product only menu options", () => {
        cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-manage-product-access.json' });
        cy.visit("/");

        cy.get('nav .space-x-2 button.max-w-xs').then($adminMenu => {
          if ($adminMenu.length > 0 && $adminMenu.is(':visible')) {
            cy.get('nav .space-x-2 button.max-w-xs').click();
            cy.contains('body', 'Manage Products');
            cy.contains('body', 'Manage Special Editions').should('not.be.visible');
          } else {
            cy.get('nav .space-x-2 > button').then($userMenu => {
              if ($userMenu.length > 0 && $userMenu.is(':visible')) {
                cy.get('nav .space-x-2 > button').click();
                cy.contains('body', 'Manage Products');
                cy.contains('body', 'Manage Special Editions').should('not.be.visible');
              }
            })
          }
        });
      });
    });

    describe("User with manage special editions access", () => {
      it("should have the manage special editions only menu options", () => {
        cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-manage-special-editions-access.json' });
        cy.visit("/");

        cy.get('nav .space-x-2 button.max-w-xs').then($adminMenu => {
          if ($adminMenu.length > 0 && $adminMenu.is(':visible')) {
            cy.get('nav .space-x-2 button.max-w-xs').click();
            cy.contains('body', 'Manage Products').should('not.be.visible');
            cy.contains('body', 'Manage Special Editions');
          } else {
            cy.get('nav .space-x-2 > button').then($userMenu => {
              if ($userMenu.length > 0 && $userMenu.is(':visible')) {
                cy.get('nav .space-x-2 > button').click();
                cy.contains('body', 'Manage Products').should('not.be.visible');
                cy.contains('body', 'Manage Special Editions');
              }
            })
          }
        });
      });
    });

  });

  describe("Using specific selectors", () => {
    describe("User with full access", () => {
      it("should have the full menu options", () => {
        cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-full-access.json' });
        cy.visit("/");

        cy.get('button[data-cy-selector="adminMenu"]').then($adminMenu => {
          if ($adminMenu.length > 0 && $adminMenu.is(':visible')) {
            cy.get('button[data-cy-selector="adminMenu"]').click();
            cy.get('a[data-cy-selector="manageProductsAdmin"]').should("be.visible");
            cy.get('a[data-cy-selector="manageSpecialEditionsAdmin"]').should("be.visible");
          } else {
            cy.get('button[data-cy-selector="mobileMenu"]').then($userMenu => {
              if ($userMenu.length > 0 && $userMenu.is(':visible')) {
                cy.get('button[data-cy-selector="mobileMenu"]').click();
                cy.get('li[data-cy-selector="manageProducts"]').should("be.visible");
                cy.get('li[data-cy-selector="manageSpecialEditions"]').should("be.visible");
              }
            })
          }
        });
      });
    });

    describe("User with manage product access", () => {
      it("should have the manage product only menu options", () => {
        cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-manage-product-access.json' });
        cy.visit("/");

        cy.get('button[data-cy-selector="adminMenu"]').then($adminMenu => {
          if ($adminMenu.length > 0 && $adminMenu.is(':visible')) {
            cy.get('button[data-cy-selector="adminMenu"]').click();
            cy.get('a[data-cy-selector="manageProductsAdmin"]').should("not.be.visible");
            cy.get('a[data-cy-selector="manageSpecialEditionsAdmin"]').should("be.visible");
          } else {
            cy.get('button[data-cy-selector="mobileMenu"]').then($userMenu => {
              if ($userMenu.length > 0 && $userMenu.is(':visible')) {
                cy.get('button[data-cy-selector="mobileMenu"]').click();
                cy.get('li[data-cy-selector="manageProducts"]').should("be.visible");
                cy.get('li[data-cy-selector="manageSpecialEditions"]').should("not.be.visible");
              }
            })
          }
        });
      });
    });

    describe("User with manage special editions access", () => {
      it("should have the manage special editions only menu options", () => {
        cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-manage-special-editions-access.json' });
        cy.visit("/");

        cy.get('button[data-cy-selector="adminMenu"]').then($adminMenu => {
          if ($adminMenu.length > 0 && $adminMenu.is(':visible')) {
            cy.get('button[data-cy-selector="adminMenu"]').click();
            cy.get('a[data-cy-selector="manageProductsAdmin"]').should("not.be.visible");
            cy.get('a[data-cy-selector="manageSpecialEditionsAdmin"]').should("be.visible");
          } else {
            cy.get('button[data-cy-selector="mobileMenu"]').then($userMenu => {
              if ($userMenu.length > 0 && $userMenu.is(':visible')) {
                cy.get('button[data-cy-selector="mobileMenu"]').click();
                cy.get('li[data-cy-selector="manageProducts"]').should("not.be.visible");
                cy.get('li[data-cy-selector="manageSpecialEditions"]').should("be.visible");
              }
            })
          }
        });
      });
    });

  });
});
