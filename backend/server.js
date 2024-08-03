const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const checkIp = require('./middleware/checkIp'); // Import the middleware
const { exec } = require('child_process');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(checkIp); // Apply the IP check middleware to all routes
app.use(routes);

// Periodically update the allowed IP address
const updateInterval = 1000 * 60 * 10; // 10 minutes

setInterval(() => {
    exec('node updateIp.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error updating IP address: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }
        console.log(`IP address updated: ${stdout}`);
    });
}, updateInterval);

app.get('/', (req, res) => {
    return res.json({
        message: 'Hello! Backend World'
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
