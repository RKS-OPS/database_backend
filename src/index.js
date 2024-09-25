const express = require("express");
const app = express();
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const OpenApiValidator = require("express-openapi-validator");
const path = require("path");

// Load your OpenAPI documentation (YAML format)
const file = fs.readFileSync("./src/OpenAPIDocs/index.yaml", "utf8");
// console.log("File content:", file);
const swaggerDocument = YAML.parse(file);
// console.log("Parsed document:", JSON.stringify(swaggerDocument, null, 2));
// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware: Parse incoming JSON requests
app.use(express.json());

// Load OpenAPI Validator
app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, "src", "OpenAPIDocs", "index.yaml"),
    validateRequests: true,
    validateResponses: true,
  })
);
// Use routes
app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
