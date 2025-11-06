const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    // Get all output contexts
    const contexts = req.body.queryResult.outputContexts || [];

    // Find your context that stores collected parameters
    // Replace 'booking-info' with the actual context name you used
    const bookingContext = contexts.find(c => c.name.endsWith('booking-info')) || {};

    // Get parameters from that context
    const params = bookingContext.parameters || {};

    // Extract each parameter safely
    const budget = params.Budget || "Not provided";
    const drivingType = params.DrivType || "Not provided";
    const fuelType = params.FuelPref || "Not provided";
    const passengerCount = params.PassCnt || "Not provided";
    const vehicleType = params.VehType || "Not provided";

    const responseText = `Here are the parameters I received:
Budget: ${budget}
Driving Type: ${drivingType}
Fuel Type: ${fuelType}
Passenger Count: ${passengerCount}
Vehicle Type: ${vehicleType}`;

    console.log("Webhook response:", responseText);

    return res.json({
        fulfillmentText: responseText
    });
});

// Optional health check
app.get('/', (req, res) => res.send("Webhook is running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

