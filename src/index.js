const express = require("express");
const app = express();
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const OpenApiValidator = require("express-openapi-validator");
const path = require("path");
const SwaggerParser = require("swagger-parser");
const cors = require("cors");
const db = require("./configs/postgres");

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
    const allowedOrigins = [
      "http://localhost:3000",
      "https://database-frontend-test.vercel.app",
    ];

    const corsOptions = {
      origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    };

    app.use(cors(corsOptions));

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

    // Test database connection
    db.query("SELECT NOW()")
      .then((res) => {
        console.log("Connected, current time from DB:", res.rows[0]);
      })
      .catch((err) => {
        console.error("Failed to execute test query", err);
      });
  } catch (err) {
    console.error("Failed to parse OpenAPI spec:", err);
  }
};

// Initialize the server
startServer();
