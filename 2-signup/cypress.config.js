export default {
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: false,
  reporter: 'mochawesome',
  defaultCommandTimeout: 100,
  e2e: {
    specPattern: 'cypress/e2e/UIDSFullCodeNoTestCases.cy.js',
    baseUrl: 'http://localhost:8080',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
};
