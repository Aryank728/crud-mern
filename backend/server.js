const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const checkIp = require('./middleware/checkIp'); // Import the middleware

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(checkIp); // Apply the IP check middleware to all routes
app.use(routes);

app.get('/', (req, res) => {
    return res.json({
        message: 'Hello! Backend World'
    });
});

app.listen(8000, () => {
    console.log('Server started on port 8000');
});
