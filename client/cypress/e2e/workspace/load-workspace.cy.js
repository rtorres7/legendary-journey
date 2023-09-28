describe('Loading the workspace dashboard', () => {
  it('should only display an empty Recently published section and the stats when no data found', () => {
    cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-full-access.json' });
    cy.intercept('GET', '/api/alerts/list', { fixture: 'empty-alerts.json' });
    cy.intercept('GET', '/api/special_editions/links', { fixture: 'empty-special-edition-links.json' });
    cy.intercept('GET', '/api/metadata', { fixture: 'metadata.json' });
    cy.intercept('GET', '/api/workspace/drafts', { fixture: 'workspace/empty-workspace-drafts.json' });
    cy.intercept('GET', '/api/workspace/saved', { fixture: 'workspace/empty-workspace-saved.json' });
    cy.intercept('GET', '/api/workspace/recent', { fixture: 'workspace/empty-workspace-recents.json' });
    cy.intercept('GET', '/api/workspace/stats', { fixture: 'workspace/empty-workspace-stats.json' });

    cy.visit('/workspace');
    cy.contains('Recently Published');
    cy.contains('No published products to show');
    cy.contains('Total Created');
    cy.contains('10');
    cy.contains('Total Views');
    cy.contains('5');
  });

  it('should display recently saved section when saved products exist', () => {
    cy.intercept('GET', '/api/my_wire/user_data', { fixture: 'users/user-with-full-access.json' });
    cy.intercept('GET', '/api/alerts/list', { fixture: 'empty-alerts.json' });
    cy.intercept('GET', '/api/special_editions/links', { fixture: 'empty-special-edition-links.json' });
    cy.intercept('GET', '/api/metadata', { fixture: 'metadata.json' });
    cy.intercept('GET', '/api/workspace/drafts', { fixture: 'workspace/empty-workspace-drafts.json' });
    cy.intercept('GET', '/api/workspace/saved', { fixture: 'workspace/workspace-saved.json' });
    cy.intercept('GET', '/api/workspace/recent', { fixture: 'workspace/empty-workspace-recents.json' });
    cy.intercept('GET', '/api/workspace/stats', { fixture: 'workspace/empty-workspace-stats.json' });

    cy.visit('/workspace');

    cy.contains("For You");
    cy.contains("Recently Saved");
    cy.contains('Recently Published');
    cy.contains('No published products to show');
    cy.contains('Total Created');
    cy.contains('10');
    cy.contains('Total Views');
    cy.contains('5');
  });
});
