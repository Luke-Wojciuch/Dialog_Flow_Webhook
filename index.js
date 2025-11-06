const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    // Get all output contexts
    const contexts = req.body.queryResult.outputContexts || [];

    // Function to safely get parameter from a context
    const getParam = (paramName) => {
        for (let ctx of contexts) {
            if (ctx.parameters && ctx.parameters[paramName] !== undefined) {
                return ctx.parameters[paramName];
            }
        }
        return "Not provided";
    };

    // Extract each parameter
    const budget = getParam('Budget');
    const drivingType = getParam('DrivingTypes');
    const fuelType = getParam('FuelPref');
    const passengerCount = getParam('PassCnt');
    const vehicleType = getParam('VehType');

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

app.get('/', (req, res) => res.send("Webhook is running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



