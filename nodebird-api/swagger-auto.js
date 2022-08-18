const swaggerAutogen = require('swagger-autogen')();

const docs = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'nodebird-api',
  },
  host: 'localhost:8002',
  //schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/v2.js'];
swaggerAutogen(outputFile, endpointsFiles, docs);
