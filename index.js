const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const params = req.body.queryResult.parameters;

    const budget = params.budget || "Not provided";
    const drivingType = params.driving_type || "Not provided";
    const fuelType = params.fuel_type || "Not provided";
    const passengerCount = params.passenger_count || "Not provided";
    const vehicleType = params.vehicle_type || "Not provided";

    const responseText = `Here are the parameters I received:\n
Budget: ${budget}\n
Driving Type: ${drivingType}\n
Fuel Type: ${fuelType}\n
Passenger Count: ${passengerCount}\n
Vehicle Type: ${vehicleType}`;

    return res.json({
        fulfillmentMessages: [
            { text: { text: [responseText] } }
        ]
    });
});

app.get('/', (req, res) => res.send("Webhook is running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
