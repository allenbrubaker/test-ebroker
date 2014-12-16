Instructions
============

End-to-end tests use protractor and is built with node js. To run the tests follow these instructions:

- Install JDK version 8 since this is required for the selenium standalone server .jar. 
- Install node and npm either by visiting the website or using chocolatey with the command. 

```
choco install nodejs
```

- Clone the Medicareful project and navigate to the directory.
- Use the following command to install the required node modules.

```
npm install
```

- Run Medicareful at https://localhost:44302/ .  If the port needs to change, open gulpfile.js and update the target property.
- To run tests, enter the following command:

```
npm test
```

Quote Engine Basic Acceptance Tests
======================================

- [x] TestHealthInsuranceQuote - Verify that Health Insurance plans show when entering zipcode & dependent information


- [x] TestPlanInfo - Verify that a user is able to enter a zip, get an instant quote and click the Plan Info button that will display information for that plan


- [ ] TestTaxCreditQualification - Verify that a user is able to click the Qualify for Tex Credit button, enter data, receive tax credit information and that information displays within the plan information area


- [ ] TestLogin - Verify that a user is able to select a plan, checkout, select and agent and login to Agency Central


- [ ] TestSaveApplicationandLogout - Verify that a user is able to go through the process of selecting a plan, checking out, logging in to Agency Central and Saving the application that they just started and Logout


- [ ] TestSaveComparison - Verify that a user is able to select 2 plans to compare and then login to Agency Central and Save


- [ ] TestSaveQuote - Verify that a user is able to select a plan, login and save that quote


- [ ] TestUserRegistration - Verify that a user is able to select a plan and then register on Agency Central as a new user

