const express = require("express");
const app = express();
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const OpenApiValidator = require("express-openapi-validator");
const path = require("path");
const SwaggerParser = require("swagger-parser");
const cors = require("cors");

const apiSpecPath = path.join(__dirname, "OpenAPIDocs", "index.yaml");

const startServer = async () => {
  try {
    // Load and resolve OpenAPI documentation
    const swaggerDocument = await SwaggerParser.validate(apiSpecPath);

    // Serve Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Middleware: Parse incoming JSON requests
    app.use(express.json());

    // Load OpenAPI Validator
    app.use(
      OpenApiValidator.middleware({
        apiSpec: swaggerDocument, // Use the resolved document
        validateRequests: true,
        validateResponses: true,
      })
    );
    // remove this line, just for testing
    app.use(cors({ origin: "http://localhost:3000" }));

    // Use routes
    app.use("/api", routes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
      });
    });

    // Start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to parse OpenAPI spec:", err);
  }
};

// Initialize the server
startServer();
