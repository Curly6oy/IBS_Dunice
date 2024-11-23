const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = app => {
    const corsOptions = {
        origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // Укажите разрешённые домены
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }

    app.use(bodyParser.json())
       .use(cors(corsOptions))
}
