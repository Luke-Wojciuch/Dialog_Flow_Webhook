const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON requests

// In-memory session store
const sessions = {};

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const sessionId = req.body.session;
    const params = req.body.queryResult.parameters || {};

    // Initialize session
    if (!sessions[sessionId]) sessions[sessionId] = {};

    // Merge new parameters into session
    Object.assign(sessions[sessionId], params);

    // Destructure stored parameters
    const { Budget, PassengerCounts, FuelPreferences, DrivingTypes, VehicleTypes } = sessions[sessionId];

    // Only respond if all required parameters are collected
    if (Budget && PassengerCounts && FuelPreferences && DrivingTypes && VehicleTypes) {
        const rec = recommendFord(Budget, PassengerCounts, FuelPreferences, DrivingTypes, VehicleTypes);

        const response = {
            fulfillmentMessages: [
                {
                    text: {
                        text: [
                            `🚗 Your Perfect Ford Match!\n\n✨ Based on your preferences:\n` +
                            `💰 Budget: ${Budget}\n` +
                            `👥 Passengers: ${PassengerCounts}\n` +
                            `⛽ Fuel Type: ${FuelPreferences}\n` +
                            `🛣️ Driving Style: ${DrivingTypes}\n` +
                            `🚙 Vehicle Type: ${VehicleTypes}\n\n`
                        ]
                    }
                },
                {
                    payload: {
                        richContent: [
                            [
                                {
                                    type: "info",
                                    title: `✅ ${rec.model}`,
                                    subtitle: rec.description,
                                    image: { src: { rawUrl: rec.image } },
                                    actionLink: rec.url
                                },
                                { type: "divider" },
                                { type: "chips", options: [{ text: "View Details", link: rec.url }] }
                            ]
                        ]
                    }
                }
            ]
        };

        console.log(`✅ Recommended: ${rec.model}`);
        return res.json(response);
    }

    // Parameters not complete: end request silently
    return res.sendStatus(200);
});

// Ford recommendation logic
function recommendFord(budget, passengers, fuel, driving, vehType) {
    if (budget === "Under $20,000") {
        return {
            model: "Used Ford Vehicle",
            description: "For budgets under $20,000, consider purchasing a certified pre-owned Ford. Reliable Escapes, Fusions, or Mavericks are available at local dealers.",
            url: "https://www.fordblueadvantage.com/",
            image: "https://www.fordblueadvantage.com/content/dam/ford/blueadvantage/hero/ford-blue-advantage-certified-used.jpg"
        };
    }

    if (budget === "$20,000-$30,000") {
        if (vehType === "SUV" && (fuel === "Gas" || fuel === "Hybrid")) {
            return {
                model: "Ford Escape",
                description: "Compact SUV with seating for 5, up to 41 MPG, and excellent safety features. Perfect for city or family use.",
                url: "https://www.ford.com/suvs/escape/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
            };
        }
        if (vehType === "Truck") {
            return {
                model: "Ford Maverick",
                description: "Compact pickup with up to 37 MPG and 4,000 lb towing capacity. Ideal for cargo flexibility and efficiency.",
                url: "https://www.ford.com/trucks/maverick/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/trucks/maverick/2025/collections/25_ford_maverick.png"
            };
        }
        if (vehType === "Sedan" && fuel === "Hybrid") {
            return {
                model: "Ford Fusion Hybrid",
                description: "Efficient midsize sedan with 47 MPG and Ford Co-Pilot360™ safety features. Great for rideshare or city commuting.",
                url: "https://www.ford.com/cars/fusion/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/fusion/2020/collections/20_ford_fusion_hybrid.png"
            };
        }
    }

    if (budget === "$30,000-$40,000") {
        if (vehType === "SUV" && driving === "Adventure") {
            return {
                model: "Ford Bronco Sport",
                description: "Compact SUV designed for adventure with AWD and off-road capability. Perfect for active lifestyles.",
                url: "https://www.ford.com/suvs/bronco-sport/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/bronco-sport/2025/collections/25_ford_bronco_sport.png"
            };
        }
        if (fuel === "Electric" && vehType === "SUV") {
            return {
                model: "Ford Mustang Mach-E",
                description: "Fully electric SUV with up to 480 HP, zero emissions, and modern tech.",
                url: "https://www.ford.com/suvs/mach-e/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/mach-e/2025/collections/25_ford_mustang_mach-e.png"
            };
        }
    }

    if (budget === "$40,000+") {
        if (vehType === "SUV" && passengers === "5-7") {
            return {
                model: "Ford Explorer",
                description: "Spacious three-row SUV with up to 400 HP, AWD, and top safety features. Ideal for families or group transport.",
                url: "https://www.ford.com/suvs/explorer/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/explorer/2025/collections/25_ford_explorer.png"
            };
        }
        if (fuel === "Electric" && vehType === "SUV") {
            return {
                model: "Ford Mustang Mach-E (Premium Trim)",
                description: "Upgraded all-electric SUV with high performance, long range, and premium comfort.",
                url: "https://www.ford.com/suvs/mach-e/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/mach-e/2025/collections/25_ford_mustang_mach-e.png"
            };
        }
    }

    // Default fallback
    return {
        model: "Ford Escape",
        description: "Reliable, versatile SUV suitable for most drivers. Available in hybrid and gasoline models.",
        url: "https://www.ford.com/suvs/escape/",
        image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
    };
}

// Root endpoint
app.get('/', (req, res) => res.send("🚗 Ford Recommendation Webhook is running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
