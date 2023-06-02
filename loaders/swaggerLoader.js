const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')


module.exports = (app) => {
    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Library books API',
                // description: env.app.description,
                version: '1.0.0',
                contact: {
                    name: 'Ngo Quoc Hieu',
                    email: 'quochieutb12@gmail.com',
                },
                components: {
                    securitySchemes: {
                      bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                        name: "authorization",
                      },
                    },
                  },
                servers: [
                    {
                        url : "https://api-start-deploy.herokuapp.com/",
                        description: "heroku",
                    },
                    {
                        url: "http://localhost:3000",
                        description: "localhost",
                      },
                ], 
                license: {
                    name: 'By © Quoc Hieu',
                    url: 'https://www.facebook.com/qhieuit',
                },
            },
        },
        apis: ['docs/*.yml', 'routes/*.js'],
    }
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))
}

    