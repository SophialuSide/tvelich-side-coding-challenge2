# Introduction

Hi there 👋,

Thank you for completing this brief take-home assignment. Your time and effort are greatly appreciated. Please timebox your effort to a maximum of 3 hours.

The purpose of this exercise is to evaluate your backend skills in Node.js, SQL, and testing. Please note that you may make assumptions, simplifications, or other changes to the problems, but please state them clearly in your write-up when you submit this assignment. Please feel free to use libraries as appropriate, as there is no need to reinvent the wheel.

Before starting, please review the instructions carefully.

**Good luck 🙃**

# Acceptance criteria

Your task is to build a REST API using Nodejs and SQLite to manage a property list. 

The API should enable users to perform CRUD actions (create, read, update, delete) on property data from the database.

Requests should be validated where applicable.

Invalid requests and other errors should be handled appropriately along with the appropriate HTTP status codes. You may use your discretion regarding error responses themselves.

Where applicable, endpoints returning multiple records should be filterable and support pagination. You may choose any pagination strategy you are familiar with.

The SQLite database is pre-seeded with data from the SimplyRETS API get_properties endpoint.

We encourage you to use TypeORM since we use it heavily at Side. If you have a different approach, feel free to proceed, but please document the reasons / tradeoffs.

# What you will be assessed on?

- The satisfaction of all functional requirements
- Production-like code that is well-coded, clean, and commented
- Passing and meaningful unit or integration tests
- TypeScript is recommended

# Submission

Once you are satisfied with your assignment, please publish your code (ignore the `node_modules` folder) to a Git repository and send the repository link to `eng.assignment@sideinc.com`.

# Getting started

With latest Node LTS installed, run the following commands:

```sh
yarn install && yarn start
```

## What will you find inside this boilerplate

In this boilerplate, you will find:

- The main entry file: `index.ts`
- A seeded SQLite DB with Properties data from SimplyRETS API `property.db`
- A `dataSource.ts` file for creating typeorm DataSource instance
- A `entities` folder contains the property TypeORM entity
- A `services` folder for you to add the service classes that encapsulate the business logic
- A `routers` folder for you to add the API routes and mapping them to the appropriate controller methods.
- A `README.md` file to document your comments and design decisions
- Inside the `package.json`, we added the following packages:
  - `express`
  - `sqlite3`
  - `typeorm`
  - `body-parser`
  - `jest`
  - `ts-node`
  - `reflect-metadata`
  - `@types/node`
- A `renovate.json` file - you can ignore this, it is just settings for a tool we use to keep dependencies up to date in the assignment
