// Les variables ci-dessous peuvent être utilisées pour vous aider
// dans l'écriture de vos tests
const tomato = 'rgb(255, 99, 71)',
  green = 'rgb(0, 128, 0)';

describe('test-signup', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8090/');
  });

  it('TF1 : "John Doe" is a valid name', () => {
    cy.get('#first-name-field').type('John')
    .should('have.class', 'valid')
    .and('have.css', 'border-color', green);

    cy.wait(300);

    cy.get('#last-name-field').type('Doe')
    .should('have.class', 'valid')
    .and('have.css', 'border-color', green);

    cy.get('#validation-name')
    .should('be.visible')
    .and('have.class', 'valid')
    .and('contain.text', 'Welcome John Doe!');
  });

  it('TF2 : "00ab" is an invalid first name', () => {
    // Simulate keyboard entry of "00ab"
    cy.get('#first-name-field')
      .type('00ab')
      .should('have.class', 'invalid')
      .and('have.css', 'border-color', tomato); // Tomato color

    // Verify error message content and styling
    cy.get('#validation-name')
      .should('be.visible')
      //.and('have.class', 'invalid')
      .and('have.text', 'At least two characters needed, only letters, spaces, and dashes')
      .and('have.css', 'color', tomato); // Tomato color
  });

  it('TF3: "abc@provider." is an invalid e-mail address', () => {
    cy.get('#email-field')
      .type('abc@provider.')
      .should('have.class', 'invalid')
      .and('have.css', 'border-color', tomato);

    // Verify error message content and styling
    cy.get('#validation-email')
      .should('be.visible')
      //.and('have.class', 'invalid')
      .and('contain.text', 'Wrong email format')
      .and('have.css', 'color', tomato);
  });

  it('TF4: a valid field has a green border color and the validation message is green', () => {
    // Enter valid email format
    cy.get('#email-field')
      .type('valid@example.com');

    // Verify field styling
    cy.get('#email-field')
      .should('have.class', 'valid')
      .and('have.css', 'border-color', green); // Green border

    // Verify validation message
    cy.get('#validation-email')
      .should('be.visible')
      .and('have.class', 'valid')
      .and('have.text', 'Correct email format')
      .and('have.css', 'color', green); // Green text
  });

  it('TF5: an invalid field has a tomato border color and the validation message is tomato', () => {
    // Simulate invalid email entry
    cy.get('#email-field')
      .type('invalid-email');

    // Check field invalidity and border color
    cy.get('#email-field')
      .should('have.class', 'invalid')
      .and('have.css', 'border-color', tomato); // rgb(255, 99, 71)

    // Verify validation message styling and content
    cy.get('#validation-email')
      .should('be.visible')
      .and('have.class', 'invalid')
      .and('have.text', 'Wrong email format') // Exact match from ui.js
      .and('have.css', 'color', tomato);
  });

  it('TF6 : an email that has not already been used displays a success message', () => {
    // À compléter
  });

  it('TF7 : an email that has already been used displays an error message', () => {
    // À compléter
  });

  it('TF8 : entering a wrong Capcha displays an error message', () => {
    // À compléter
  });

  it('TF9 : entering a correct Capcha displays a success message', () => {
    // À compléter
  });

  it('TF10 : adding a programming language creates a new badge', () => {
    // À compléter
  });

  it('TF11 : entering less than three programming languages displays an error message', () => {
    // À compléter
  });

  it('TF12 : entering three or more programming languages is valid', () => {
    // À compléter
  });

  it('TF13 : the signup form can be validated upon completing all fields', () => {
    // À compléter
  });
});
