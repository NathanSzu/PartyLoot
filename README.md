# Getting Started with Party Loot

## Description

This project is a progressive web application intended to assist players at the game table with a collaborative notekeeping experience to track inventory, currency, and other treasures gained throughout a roleplaying adventure. Every entry can be organized by party member and searched by item name, description, or user defined tags. Planned features also include the addition of session notekeeping, and creating shared house rule documents for reference.

![](https://i.imgur.com/t5BHeHp.png)

## Project Setup

1. Clone the repository
2. Install Packages (npm install)
3. Environment Setup

### Environment Setup

This project has commands built to allow easy running and deployment to two different firebase projects/environments. To set this up you will want to create a new firebase project following the instructions here [Firebase Project Setup](https://firebase.google.com/docs/web/setup?authuser=0#create-project). Keep in mind that you will need to setup firebase auth (email only), and firestore database. Then in the src/utils directory you will see a file titled .env.example. Once that project has been created, edit .env.example to contain the correct environment variables and re-save it with the name .env.development.

You may repeat this process to add another environment (.env.production) but not required. Console commands for the application are environment specific and can be found in package.json.

## Project Contribution

Community contributions are welcome! Please follow [this guide](https://www.dataschool.io/how-to-contribute-on-github/) to suggest contributions.