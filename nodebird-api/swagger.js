const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'nodebird-api',
    },
    host: 'localhost:8002',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {}, // ADD THIS LINE!!!
  },
  apis: ['app.js', './routes/*.js'],
};

const spec = swaggerJsDoc(options);

module.exports = { swaggerUi, spec };
