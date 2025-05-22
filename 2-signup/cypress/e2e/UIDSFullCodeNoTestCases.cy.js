// Les variables ci-dessous peuvent être utilisées pour vous aider
// dans l'écriture de vos tests
const tomato = 'rgb(255, 99, 71)',
  green = 'rgb(0, 128, 0)';

describe('UI Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8080/api/capcha', { 
      body: { op1: 3, op2: 5 } 
    }).as('getCapcha');
    cy.visit('http://localhost:8090/');
    cy.wait('@getCapcha');
  });

  it('should show validation errors for empty form submission', () => {
    cy.get('#signup-btn').click();
    cy.get('.invalid').should('have.length.at.least', 5);
  });

  it('should validate name fields', () => {
    cy.get('#first-name-field').type('J1');
    cy.get('#validation-name').should('contain', 'only letters');
    cy.get('#first-name-field').clear().type('John');
    cy.get('#last-name-field').type('D');
    cy.get('#validation-name').should('contain', 'At least two');
    cy.get('#last-name-field').clear().type('Doe');
    cy.get('#validation-name').should('contain', 'Welcome John Doe');
  });

  it('should validate email field', () => {
    cy.intercept('GET', '/api/users/exists*', { presentInDatabase: false }).as('emailCheck');
    
    cy.get('#email-field').type('invalid');
    cy.get('#validation-email').should('contain', 'Wrong email format');
    cy.get('#email-field').clear().type('valid@email.com');
    cy.get('#validation-email').should('contain', 'Correct email format');
  });

  it('should show error for existing email', () => {
    cy.intercept('GET', '/api/users/exists*', { 
      presentInDatabase: true,
      msg: 'Email already registered'
    }).as('emailExists');
    
    cy.get('#email-field').type('existing@email.com').blur();
    cy.get('#validation-email').should('contain', 'already registered');
  });

  it('should validate programming languages', () => {
    cy.get('#language-list li').first().click().type('JavaScript').blur();;
    cy.get('#validation-languages').should('contain', '2 remaining');
    cy.get('#language-list li').last().click().type('Python').blur();
    cy.get('#language-list li').last().click().type('Java').blur();
    cy.get('#validation-languages').should('not.contain', 'remaining');
  });

  it('should validate and regenerate CAPTCHA', () => {
    cy.get('#capcha-field').type('7');
    cy.get('#validation-capcha').should('contain', 'robot');
    cy.get('#capcha-field').clear().type('8');
    cy.get('#validation-capcha').should('contain', 'Nice work');
    cy.get('#reload-btn').click();
    cy.get('#capcha-field').clear().type('8');
    cy.get('#validation-capcha').should('contain', 'Nice work');
  });

  it('should successfully submit valid form', () => {
    cy.intercept('POST', '/api/users/signup', {
      statusCode: 200,
      body: { id: 1, email: 'test@email.com' }
    }).as('signupRequest');

    cy.get('#first-name-field').type('John');
    cy.get('#last-name-field').type('Doe');
    cy.get('#email-field').type('test@email.com');
    
    cy.get('#language-list li').first()
      .click().type('JavaScript').blur()
      .wait(100)
      .get('#language-list li').last()
      .click().type('Python').blur()
      .wait(100)
      .get('#language-list li').last()
      .click().type('Java').blur();

    cy.get('#capcha-field').type('8');
    cy.get('#signup-btn').should('not.be.disabled').click();
    
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Success! Email "test@email.com"');
    });
  });
});