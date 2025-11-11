const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const contexts = req.body.queryResult.outputContexts || [];
    const sessionPath = req.body.session;

    const getParam = (name) => {
        // Check parameters from queryResult first (current intent)
        if (req.body.queryResult.parameters && req.body.queryResult.parameters[name] !== undefined) {
            return req.body.queryResult.parameters[name];
        }
        
        // Then check output contexts (previous intents)
        for (let ctx of contexts) {
            if (ctx.parameters && ctx.parameters[name] !== undefined) {
                return ctx.parameters[name];
            }
        }
        return "Not provided";
    };

    const budget = getParam('Budget');
    const passengers = getParam('PassengerCounts');
    const fuel = getParam('FuelPreferences');
    const driving = getParam('DrivingTypes');
    const vehicleType = getParam('VehicleTypes');

    // Log captured parameters for debugging
    console.log('📊 Captured Parameters:', {
        budget,
        passengers,
        fuel,
        driving,
        vehicleType
    });

    // Vehicle recommendation logic based on your report
    function recommendFord(budget, passengers, fuel, driving, vehType) {
        // 1️⃣ Budget under $20k → Recommend used cars
        if (budget === "Under $20,000") {
            return {
                model: "Used Ford Vehicle",
                description: "For budgets under $20,000, consider purchasing a certified pre-owned Ford. Reliable Escapes, Fusions, or Mavericks are available at local dealers.",
                url: "https://www.fordblueadvantage.com/",
                image: "https://www.fordblueadvantage.com/content/dam/ford/blueadvantage/hero/ford-blue-advantage-certified-used.jpg"
            };
        }
    
        // 2️⃣ $20k–$30k → Escape, Maverick, Fusion Hybrid
        if (budget === "$20,000-$30,000") {
            // Truck preference gets Maverick
            if (vehType === "Truck") {
                return {
                    model: "Ford Maverick",
                    description: "Compact pickup with up to 37 MPG and 4,000 lb towing capacity. Ideal for cargo flexibility and efficiency.",
                    url: "https://www.ford.com/trucks/maverick/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/trucks/maverick/2025/collections/25_ford_maverick.png"
                };
            }
            
            // Sedan preference gets Fusion Hybrid
            if (vehType === "Sedan") {
                return {
                    model: "Ford Fusion Hybrid",
                    description: "Efficient midsize sedan with 47 MPG and Ford Co-Pilot360™ safety features. Great for rideshare or city commuting.",
                    url: "https://www.ford.com/cars/fusion/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/fusion/2020/collections/20_ford_fusion_hybrid.png"
                };
            }
            
            // SUV or default gets Escape
            return {
                model: "Ford Escape",
                description: "Compact SUV with seating for 5, up to 41 MPG, and excellent safety features. Perfect for city or family use.",
                url: "https://www.ford.com/suvs/escape/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
            };
        }
    
        // 3️⃣ $30k–$40k → Bronco Sport or base Mach-E
        if (budget === "$30,000-$40,000") {
            // Sedan still gets Fusion (best fit in this range)
            if (vehType === "Sedan") {
                return {
                    model: "Ford Fusion Hybrid",
                    description: "Efficient midsize sedan with 47 MPG and Ford Co-Pilot360™ safety features. Great for rideshare or city commuting.",
                    url: "https://www.ford.com/cars/fusion/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/fusion/2020/collections/20_ford_fusion_hybrid.png"
                };
            }
            
            // Electric preference gets Mach-E
            if (fuel === "Electric") {
                return {
                    model: "Ford Mustang Mach-E",
                    description: "Fully electric SUV with up to 480 HP, zero emissions, and modern tech.",
                    url: "https://www.ford.com/suvs/mach-e/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/mach-e/2025/collections/25_ford_mustang_mach-e.png"
                };
            }
            
            // Adventure/Mixed-use or SUV gets Bronco Sport
            if (driving === "Mixed-use" || vehType === "SUV") {
                return {
                    model: "Ford Bronco Sport",
                    description: "Compact SUV designed for adventure with AWD and off-road capability. Perfect for active lifestyles.",
                    url: "https://www.ford.com/suvs/bronco-sport/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/bronco-sport/2025/collections/25_ford_bronco_sport.png"
                };
            }
            
            // Default to Escape
            return {
                model: "Ford Escape",
                description: "Compact SUV with seating for 5, up to 41 MPG, and excellent safety features. Perfect for city or family use.",
                url: "https://www.ford.com/suvs/escape/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
            };
        }
    
        // 4️⃣ $40k+ → Explorer or premium Mach-E
        if (budget === "$40,000+") {
            // Sedan gets Fusion (or could suggest looking at Lincoln)
            if (vehType === "Sedan") {
                return {
                    model: "Ford Fusion Hybrid",
                    description: "Efficient midsize sedan with 47 MPG and Ford Co-Pilot360™ safety features. For luxury sedans, consider Lincoln models.",
                    url: "https://www.ford.com/cars/fusion/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/fusion/2020/collections/20_ford_fusion_hybrid.png"
                };
            }
            
            // Electric preference gets premium Mach-E
            if (fuel === "Electric") {
                return {
                    model: "Ford Mustang Mach-E (Premium Trim)",
                    description: "Upgraded all-electric SUV with high performance, long range, and premium comfort.",
                    url: "https://www.ford.com/suvs/mach-e/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/mach-e/2025/collections/25_ford_mustang_mach-e.png"
                };
            }
            
            // Large family or 5-7 passengers gets Explorer
            if (passengers === "5-7" || passengers === "7+") {
                return {
                    model: "Ford Explorer",
                    description: "Spacious three-row SUV with up to 400 HP, AWD, and top safety features. Ideal for families or group transport.",
                    url: "https://www.ford.com/suvs/explorer/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/explorer/2025/collections/25_ford_explorer.png"
                };
            }
            
            // Default premium option
            return {
                model: "Ford Explorer",
                description: "Spacious three-row SUV with up to 400 HP, AWD, and top safety features. Ideal for families or group transport.",
                url: "https://www.ford.com/suvs/explorer/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/explorer/2025/collections/25_ford_explorer.png"
            };
        }
    
        // 5️⃣ Default fallback
        return {
            model: "Ford Escape",
            description: "Reliable, versatile SUV suitable for most drivers. Available in hybrid and gasoline models.",
            url: "https://www.ford.com/suvs/escape/",
            image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
        };
    }

    const rec = recommendFord(budget, passengers, fuel, driving, vehicleType);

    // Rich response with improved formatting and context preservation
    const response = {
        fulfillmentMessages: [
            {
                text: {
                    text: [
                        `🚗 Your Perfect Ford Match!\n\n` +
                        `✨ Based on your preferences:\n` +
                        `💰 Budget: ${budget}\n` +
                        `👥 Passengers: ${passengers}\n` +
                        `⛽ Fuel Type: ${fuel}\n` +
                        `🛣️ Driving Style: ${driving}\n` +
                        `🚙 Vehicle Type: ${vehicleType}\n\n` +
                        `🎯 Recommended: ${rec.model}\n` +
                        `${rec.description ? `📋 ${rec.description}` : ''}`
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
                                subtitle: rec.description || "Your ideal Ford vehicle",
                                image: {
                                    src: { rawUrl: rec.image }
                                },
                                actionLink: rec.url
                            },
                            { type: "divider" },
                            {
                                type: "chips",
                                options: [
                                    { text: "View Details", link: rec.url }
                                ]
                            }
                        ]
                    ]
                }
            }
        ],
        // CRITICAL: Set output contexts to preserve parameters across intents
        outputContexts: [
            {
                name: `${sessionPath}/contexts/ford-params`,
                lifespanCount: 5, // Keep parameters alive for 5 interactions
                parameters: {
                    Budget: budget,
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
