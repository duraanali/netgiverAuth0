var twilio = require('twilio');

const accountSid = 'AC9d481c83207b8674ea65ec9864764cd0';
const authToken = 'your_auth_token';
const client = require('twilio')(accountSid, authToken);

client.messaging.services
    .create({
        statusCallback: 'http://requestb.in/1234abcd',
        friendlyName: 'My First Service'
    })
    .then(service => console.log(service.sid));

