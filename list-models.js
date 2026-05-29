const https = require('https');

const API_KEY = 'AIzaSyAacSITOeLCLEbh5QZRMdCJLJmgi3XqHi8';

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log("Available models:");
        json.models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
      } else {
        console.log("Error or no models:", json);
      }
    } catch (e) {
      console.error(e, data);
    }
  });
});
