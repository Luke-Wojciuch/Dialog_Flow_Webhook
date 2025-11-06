const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const params = req.body.queryResult.parameters;

    const budget = params.Budget || "Not provided";
    const drivingType = params.DrivingTypes || "Not provided";
    const fuelType = params.FuelPreferences || "Not provided";
    const passengerCount = params.PassengerCounts || "Not provided";
    const vehicleType = params.VehicleTypes || "Not provided";

    const responseText = `Here are the parameters I received:
Budget: ${budget}
Driving Type: ${drivingType}
Fuel Type: ${fuelType}
Passenger Count: ${passengerCount}
Vehicle Type: ${vehicleType}`;

    return res.json({
        fulfillmentText: responseText
    });
});

app.get('/', (req, res) => res.send("Webhook is running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
