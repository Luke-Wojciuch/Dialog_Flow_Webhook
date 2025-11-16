const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const contexts = req.body.queryResult.outputContexts || [];
    const sessionPath = req.body.session;

    const getParam = (name) => {
        if (req.body.queryResult.parameters && req.body.queryResult.parameters[name] !== undefined) {
            return req.body.queryResult.parameters[name];
        }
        for (let ctx of contexts) {
            if (ctx.parameters && ctx.parameters[name] !== undefined) {
                return ctx.parameters[name];
            }
        }
        return "Not Provided";
    };

    const budgetRaw = getParam('Budget');
    const passengers = getParam('PassengerCounts');
    const fuel = getParam('FuelPreferences');
    const driving = getParam('DrivingTypes');
    const vehicleType = getParam('VehicleTypes');

    // 🧩 1️⃣ Parse budget string into numeric values
    function parseBudget(input) {
        if (!input || typeof input !== 'string') return null;
        input = input.toLowerCase().replace(/\$/g, '').replace(/,/g, '').trim();

        // Range case (e.g. "25-30k")
        if (input.includes('-')) {
            const [minStr, maxStr] = input.split('-').map(s => s.trim());
            const minVal = minStr.includes('k') ? parseFloat(minStr) * 1000 : parseFloat(minStr);
            const maxVal = maxStr.includes('k') ? parseFloat(maxStr) * 1000 : parseFloat(maxStr);
            return { min: minVal, max: maxVal };
        }

        // Single value (e.g. "25k" or "25000")
        const val = input.includes('k') ? parseFloat(input) * 1000 : parseFloat(input);
        return { min: val, max: val };
    }

    const budgetParsed = parseBudget(budgetRaw);

    console.log('📊 Captured Parameters:', {
        budgetRaw,
        budgetParsed,
        passengers,
        fuel,
        driving,
        vehicleType
    });

    // 🧩 2️⃣ Updated logic using numeric ranges
    function recommendFord(budgetObj, passengers, fuel, driving, vehType) {
        if (!budgetObj) {
            return {
                model: "Ford Escape",
                description: "Reliable, versatile SUV suitable for most drivers.",
                url: "https://www.ford.com/suvs/escape/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
            };
        }

        const avgBudget = (budgetObj.min + budgetObj.max) / 2;

        if (avgBudget <= 20000) {
            return {
                model: "Used Ford Vehicle",
                description: "For budgets $20,000 and under, consider a certified pre-owned Ford.",
                url: "https://www.fordblueadvantage.com/",
                image: "https://www.fordblueadvantage.com/content/dam/ford/blueadvantage/hero/ford-blue-advantage-certified-used.jpg"
            };
        }

        if (avgBudget > 20000 && avgBudget < 30000) {
            if (vehType === "Truck") {
                return {
                    model: "Ford Maverick",
                    description: "Compact pickup with up to 37 MPG and 4,000 lb towing capacity.",
                    url: "https://www.ford.com/trucks/maverick/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/trucks/maverick/2025/collections/25_ford_maverick.png"
                };
            }
            if (vehType === "Sedan") {
                return {
                    model: "Ford Fusion Hybrid",
                    description: "Efficient midsize sedan with 47 MPG and Ford Co-Pilot360™ safety features.",
                    url: "https://www.ford.com/cars/fusion/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/fusion/2020/collections/20_ford_fusion_hybrid.png"
                };
            }
            return {
                model: "Ford Escape",
                description: "Compact SUV with seating for 5 and up to 41 MPG.",
                url: "https://www.ford.com/suvs/escape/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
            };
        }

        if (avgBudget >= 30000 && avgBudget <= 40000) {
             if (vehType === "Sedan") {
                return {
                    model: "Ford Fusion Hybrid",
                    description: "Efficient midsize sedan with 47 MPG and Ford Co-Pilot360™ safety features. Great for rideshare or city commuting.",
                    url: "https://www.ford.com/cars/fusion/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/fusion/2020/collections/20_ford_fusion_hybrid.png"
                };
            }
            
            if (fuel === "Electric") {
                return {
                    model: "Ford Mustang Mach-E",
                    description: "Fully electric SUV with up to 480 HP and zero emissions.",
                    url: "https://www.ford.com/suvs/mach-e/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/mach-e/2025/collections/25_ford_mustang_mach-e.png"
                };
            }
            if (driving === "Mixed-use" || vehType === "SUV") {
                return {
                    model: "Ford Bronco Sport",
                    description: "Compact SUV built for adventure and off-road capability.",
                    url: "https://www.ford.com/suvs/bronco-sport/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/bronco-sport/2025/collections/25_ford_bronco_sport.png"
                };
            }
            return {
                model: "Ford Escape",
                description: "Versatile SUV suitable for city or family driving.",
                url: "https://www.ford.com/suvs/escape/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
            };
        }

        if (avgBudget > 40000) {
            
             if (vehType === "Sedan") {
                return {
                    model: "Ford Fusion Hybrid",
                    description: "Efficient midsize sedan with 47 MPG and Ford Co-Pilot360™ safety features. For luxury sedans, consider Lincoln models.",
                    url: "https://www.ford.com/cars/fusion/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/fusion/2020/collections/20_ford_fusion_hybrid.png"
                };
            }
            
            if (fuel === "Electric") {
                return {
                    model: "Ford Mustang Mach-E Premium",
                    description: "High-performance electric SUV with luxury features.",
                    url: "https://www.ford.com/suvs/mach-e/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/mach-e/2025/collections/25_ford_mustang_mach-e.png"
                };
            }
            if (passengers === "5-7" || passengers === "7+") {
                return {
                    model: "Ford Explorer",
                    description: "Spacious three-row SUV ideal for families.",
                    url: "https://www.ford.com/suvs/explorer/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/explorer/2025/collections/25_ford_explorer.png"
                };
            }
            return {
                model: "Ford Explorer",
                description: "Premium SUV with powerful performance and space.",
                url: "https://www.ford.com/suvs/explorer/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/explorer/2025/collections/25_ford_explorer.png"
            };
        }

        return {
            model: "Ford Escape",
            description: "Reliable SUV suitable for most drivers.",
            url: "https://www.ford.com/suvs/escape/",
            image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
        };
    }

    const rec = recommendFord(budgetParsed, passengers, fuel, driving, vehicleType);

    const response = {
    fulfillmentMessages: [
        {
            payload: {
                richContent: [
                    [
                        {
                            type: "description",
                            title: "🚗 Your Perfect Ford Match!",
                            text: [
                                "Your Preferences:",
                                `• Budget: ${budgetRaw}`,
                                `• Passengers: ${passengers}`,
                                `• Fuel Type: ${fuel}`,
                                `• Driving Style: ${driving}`,
                                `• Vehicle Type: ${vehicleType}`
                            ]
                        },
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
    ],
    outputContexts: [
        {
            name: `${sessionPath}/contexts/ford-params`,
            lifespanCount: 5,
            parameters: {
                Budget: budgetRaw,
                PassengerCounts: passengers,
                FuelPreferences: fuel,
                DrivingTypes: driving,
                VehicleTypes: vehicleType
            }
        }
    ]
};
    console.log(`✅ Recommended: ${rec.model}`);
    return res.json(response);
});


app.get('/', (req, res) => res.send("🚗 Ford Recommendation Webhook is running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
