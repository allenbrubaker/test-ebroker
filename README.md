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


- [x] TestTaxCreditQualification - Verify that a user is able to click the Qualify for Tex Credit button, enter data, receive tax credit information and that information displays within the plan information area


- [x] TestLogin - Verify that a user is able to select a plan, checkout, select an agent


- [x] TestComparison - Verify that a user is able to select 2 plans to compare

Quote Engine Tests
=======================

**Plan Page**
- [x] Plans display
- [x] Ability to compare up to 8 plans
- [x] Ability to select plan info button
- [x] Ability to select More info button
- [x] Ability to Sort plans
- [x] Ability to Find out Now for Tax Credit
- [x] Ability to Edit dependants
- [x] Ability to Set the location & Edit

**Filters**
- [x] Price
- [x] Carriers
- [x] Plan Type
- [x] Metal Type
- [x] Insurance Type check boxes
- [x] Click on Disclaimer
- [x] Click on Metal Levels Info

Application Tests
======================

**Applications Tab**
- [ ] Verify display of record
- [ ] Select Plans button for record, verify contents
- [ ] Select Effective Dates button for record, verify contents
- [ ] Continue Button -> Takes user to application setup flow
- [ ] Cancel Application Button -> Confirm ability to cancel application

**Comparisons Tab**	
- [ ] Verify display of record
- [ ] Select Plans button for record, verify contents
- [ ] Select View Current Comparison button, verify contents
- [ ] Delete Comparison

**Quotes**
- [ ] Verify Display of Record
- [ ] Verify Plans button for record, verify contents
- [ ] Verify Dependants button for record, verify contents
- [ ] Verify Buy Now button
- [ ] Verify ability to delete Quote

- [ ] Verify Back to Quotes button -> takes user back to quote engine
- [ ] Verify Logout button
- [ ] Verify Filter application works

**Application**	
- [ ] Verify ability to navigate the application by clicking on the different sections at top (Demographics,Dependants,Carrier Info, etc)
- [ ] Verify Demographics tab, entering data
- [ ] Verify adding/removing Dependants & view existing dependants
- [ ] Verify Carrier Info tab -> 	yes/no question
- [ ] Verify effective date
- [ ] Verify payment
- [ ] Verify Check Out
- [ ] Verify Application Options at top (dropdown)


**Integration Tests (quote engine/application)**
=================================================

- [ ] TestLogin - Verify that a user is able to select a plan, checkout, select an agent and login to Agency Central
- [ ] TestSaveApplicationandLogout - Verify that a user is able to go through the process of selecting a plan, checking out, logging in to Agency Central and Saving the application that they just started and Logout
- [ ] TestSaveComparison - Verify that a user is able to select 2 plans to compare and then login to Agency Central and Save
- [ ] TestSaveQuote - Verify that a user is able to select a plan, login and save that quote
- [ ] TestUserRegistration - Verify that a user is able to select a plan and then register on Agency Central as a new user

**Scenario Tests**
===================

- [ ] As a user, I'd like to be able to receive a quote for Medical Insurance for myself, my husband and 10 year old dependent. I'd like to be able to save that quote for later viewing.

- [ ] As a user I'd like to compare quotes for 3 different medical plans for myself and my husband. I'd like to save that comparison for later viewing. 

- [ ] Get a quote and choose to checkout. Using existing account to log in on testapplication, verfiy that when the Demographics section shows, the first name, last name and date of birth are prefilled.

- [ ] Verify that from the shopping cart in Quote Engine, a user is able to click the back button that is shown above the plan information and is taken back the the plans page.

- [ ] Verify that after saving a comparison the Back to Quotes button shows and is able to be click and return the user to the quote engine

- [ ] Verify that the Instant Quote button is not enabled until after the Date of Birth field is filled in

- [ ] Verify that a user is able to use the Cancel button from the select agent page after getting a quote, and selecting Save Quote

