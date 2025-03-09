import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Willow",
      version: "1.1.23",
      description: 'API documentation',
      contact: {
        name: "Contact the Developer: linkedIn",
        url: "https://www.linkedin.com/in/tami-cp0"
      }
    },
    servers: [
      {
        url: `${process.env.BACKEND_URL || "http://0.0.0.0:3000"}/api/v1`,
        description: "Local server",
      },
    ]
  },
  apis: ["./src/docs/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;