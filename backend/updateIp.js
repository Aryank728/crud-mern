const fs = require('fs');
const path = require('path');
const axios = require('axios');

const updateIp = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        const currentIp = response.data.ip;
        const filePath = path.join(__dirname, 'currentIp.json');

        const ipData = { allowedIp: currentIp };
        fs.writeFileSync(filePath, JSON.stringify(ipData));

        console.log(`Updated allowed IP to ${currentIp}`);
    } catch (error) {
        console.error('Failed to update allowed IP:', error);
    }
};

updateIp();
