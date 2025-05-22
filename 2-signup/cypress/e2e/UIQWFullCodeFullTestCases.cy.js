// Les variables ci-dessous peuvent être utilisées pour vous aider
// dans l'écriture de vos tests
const tomato = 'rgb(255, 99, 71)',
  green = 'rgb(0, 128, 0)';

describe('Registration Form UI Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8090/');
  });

  // TF1: Valid First and Last Name
  it('Displays success message for John Doe', () => {
    cy.get('#first-name-field').type('John');
    cy.get('#last-name-field').type('Doe');
    cy.get('#validation-name').should('contain.text', 'Welcome John Doe!');
    cy.get('#first-name-field').should('have.class', 'valid');
    cy.get('#last-name-field').should('have.class', 'valid');
  });

  // TF2: Invalid First Name (Non-Alphabetical)
  it('Shows error for "00ab"', () => {
    cy.get('#first-name-field').type('00ab');
    cy.get('#validation-name').should('contain.text', 'At least two characters needed');
    cy.get('#first-name-field').should('have.class', 'invalid');
  });

  // TF3: Invalid Email Format
  it('Rejects "abc@provider."', () => {
    cy.get('#email-field').type('abc@provider.');
    cy.get('#validation-email').should('contain.text', 'Wrong email format');
    cy.get('#email-field').should('have.class', 'invalid');
  });

  // TF4: Valid Field Styling (Green Border)
  it('Valid field has green border color', () => {
    cy.get('#first-name-field').type('John');
    cy.get('#first-name-field').should('have.css', 'border-color', 'rgb(0, 128, 0)');
  });

  // TF5: Invalid Field Styling (Tomato Border)
  it('Invalid field has tomato border color', () => {
    cy.get('#first-name-field').type('00ab');
    cy.get('#first-name-field').should('have.css', 'border-color', 'rgb(255, 99, 71)');
  });

  // TF6: Valid Email (Not in Database)
  it('Accepts new email (abc@provider.com)', () => {
    cy.intercept('GET', '/api/users/exists?email=abc%40provider.com', {
      statusCode: 200,
      body: { presentInDatabase: false, msg: 'This email has not already been used' },
    });
    cy.get('#email-field').type('abc@provider.com');
    cy.get('#email-field').blur();
    cy.get('#validation-email').should('contain.text', 'This email has not already been used');
    cy.get('#email-field').should('have.class', 'valid');
  });

  // TF7: Invalid Email (Already Exists)
  it('Rejects existing email (abc@provider.com)', () => {
    cy.intercept('GET', '/api/users/exists?email=abc%40provider.com', {
      statusCode: 200,
      body: { presentInDatabase: true, msg: 'This email has already been used' },
    });
    cy.get('#email-field').type('abc@provider.com');
    cy.get('#email-field').blur();
    cy.get('#validation-email').should('contain.text', 'This email has already been used');
    cy.get('#email-field').should('have.class', 'invalid');
  });

  // TF8: Incorrect CAPTCHA Answer
  it('Rejects incorrect CAPTCHA answer', () => {
    cy.intercept('GET', '/capcha', { statusCode: 200, body: { op1: 5, op2: 3 } });
    cy.get('#reload-btn').click();
    cy.get('#capcha-field').type('7');
    cy.get('#validation-capcha').should('contain.text', 'The result is incorrect. Are you a robot?');
    cy.get('#capcha-field').should('have.class', 'invalid');
  });

  // TF9: Correct CAPTCHA Answer
  it('Accepts correct CAPTCHA answer', () => {
    cy.intercept('GET', '/capcha', { statusCode: 200, body: { op1: 5, op2: 3 } });
    cy.get('#reload-btn').click();
    cy.get('#capcha-field').type('8');
    cy.get('#validation-capcha').should('contain.text', 'Nice work!');
    cy.get('#capcha-field').should('have.class', 'valid');
  });

  // TF10: Language Badge Creation
  it('Creates badge on focus loss', () => {
    cy.get('#language-list li.placeholder').type('JavaScript{enter}');
    cy.get('#language-list li.badge').should('exist').and('contain.text', 'javascript');
  });

  // TF11: Less Than 3 Languages Error
  it('Shows error for 2 languages', () => {
    cy.get('#language-list li.placeholder').type('JavaScript{enter}Python{enter}');
    cy.get('#validation-languages').should('contain.text', '1 remaining.');
    cy.get('#language-list').should('have.class', 'invalid');
  });

  // TF12: Valid Language Count (≥3)
  it('Accepts 3 languages', () => {
    cy.get('#language-list li.placeholder').type('JavaScript{enter}Python{enter}Java{enter}');
    cy.get('#validation-languages').should('not.exist');
    cy.get('#language-list').should('have.class', 'valid');
    cy.get('#signup-btn').should('not.be.disabled');
  });
});