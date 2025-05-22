// Les variables ci-dessous peuvent être utilisées pour vous aider
// dans l'écriture de vos tests
const tomato = 'rgb(255, 99, 71)',
  green = 'rgb(0, 128, 0)';

describe('Registration Form UI Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8090/');
  });

  // UI Validation Tests
  it('TF1: Valid name shows success message', () => {
    cy.get('#first-name-field').type('John');
    cy.get('#last-name-field').type('Doe');
    cy.get('#validation-name')
      .should('have.class', 'valid')
      .and('contain.text', 'Welcome John Doe!');
  });

  it('TF2: Invalid first name shows error', () => {
    cy.get('#first-name-field').type('00ab');
    cy.get('#validation-name')
      .should('have.class', 'invalid')
      .and('contain.text', 'At least two characters needed');
  });

  it('TF3: Invalid email format shows error', () => {
    cy.get('#email-field').type('abc@provider.');
    cy.get('#validation-email')
      .should('have.class', 'invalid')
      .and('contain.text', 'Wrong email format');
  });

  it('TF4: Valid field styling', () => {
    cy.get('#first-name-field').type('Anna');
    cy.get('#first-name-field')
      .should('have.css', 'border-color', 'rgb(0, 128, 0)'); // Green
    cy.get('#validation-name')
      .should('have.css', 'color', 'rgb(0, 128, 0)');
  });

  it('TF5: Invalid field styling', () => {
    cy.get('#email-field').type('invalid');
    cy.get('#email-field')
      .should('have.css', 'border-color', 'rgb(255, 99, 71)'); // Tomato
    cy.get('#validation-email')
      .should('have.css', 'color', 'rgb(255, 99, 71)');
  });

  it('TF6: Valid new email shows success', () => {
    cy.intercept('GET', '/api/users/exists?email=test@example.com', {
      body: { presentInDatabase: false, msg: 'Email available' }
    }).as('emailCheck');

    cy.get('#email-field').type('test@example.com').blur();
    cy.wait('@emailCheck');
    cy.get('#validation-email').should('have.class', 'valid');
  });

  it('TF7: Existing email shows error', () => {
    cy.intercept('GET', '/api/users/exists?email=exists@example.com', {
      body: { presentInDatabase: true, msg: 'Email already exists' }
    }).as('emailCheck');

    cy.get('#email-field').type('exists@example.com').blur();
    cy.wait('@emailCheck');
    cy.get('#validation-email').should('have.class', 'invalid');
  });

  it('TF8: Wrong captcha shows error', () => {
    cy.intercept('GET', '/capcha', { body: { op1: 5, op2: 3 } }).as('captcha');
    cy.get('#reload-btn').click().wait('@captcha');
    cy.get('#capcha-field').type('7');
    cy.get('#validation-capcha')
      .should('contain.text', 'robot')
      .and('have.class', 'invalid');
  });

  it('TF9: Correct captcha shows success', () => {
    cy.intercept('GET', '/capcha', { body: { op1: 2, op2: 3 } }).as('captcha');
    cy.get('#reload-btn').click().wait('@captcha');
    cy.get('#capcha-field').type('5');
    cy.get('#validation-capcha')
      .should('contain.text', 'Nice work!')
      .and('have.class', 'valid');
  });

  it('TF10: Adding language creates badge', () => {
    cy.get('#language-list li.placeholder')
      .click()
      .type('JavaScript{enter}');
    cy.get('#language-list li.badge').should('have.length', 1);
  });

  it('TF11: Insufficient languages shows error', () => {
    // Add 2 languages
    ['Java', 'Python'].forEach(lang => {
      cy.get('#language-list li.placeholder')
        .click()
        .type(`${lang}{enter}`);
    });
    cy.get('#validation-languages')
      .should('contain.text', '1 remaining')
      .and('have.class', 'invalid');
  });

  it('TF12: Three languages valid', () => {
    // Add 3 languages
    ['Java', 'Python', 'C++'].forEach(lang => {
      cy.get('#language-list li.placeholder')
        .click()
        .type(`${lang}{enter}`);
    });
    cy.get('#validation-languages').should('have.class', 'valid');
  });
});