# Node.js Project

This is a Node.js project that includes basic setup for starting the server, running in development mode, and configuring Swagger.

## Directory Structure

```bash
src/
├── OpenAPIDocs/      # Folder for storing OpenAPI documentation files. These files describe the structure of the API, including routes, requests, and responses.
├── configs/          # Folder for configuration files, where settings like database connections
├── controllers/      # Folder for controller files. Controllers handle the business logic of the application by processing incoming requests, interacting with models, and returning appropriate responses.
├── models/           # Folder for model files. Models define the data structure and handle interactions with the database (e.g., CRUD operations).
├── routes/           # Folder for route handling files. These files define the application's routes and map them to specific controller functions.
└── index.js          # The main entry point for the application, where the server is started, and routing and other middleware are initialized.
```



## Installation

Before starting development, make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then, run the following command to install the project dependencies:

```bash
npm install
```
