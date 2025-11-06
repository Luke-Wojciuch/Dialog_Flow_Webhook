const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const contexts = req.body.queryResult.outputContexts || [];

    const getParam = (name) => {
        for (let ctx of contexts) {
            if (ctx.parameters && ctx.parameters[name] !== undefined)
                return ctx.parameters[name];
        }
        return "Not provided";
    };

    const budget = getParam('Budget');
    const passengers = getParam('PassCnt');
    const fuel = getParam('FuelPref');
    const driving = getParam('DrivType');
    const vehicleType = getParam('VehType');

    // Decision logic
    function recommendFord(budget, passengers, fuel, driving, vehType) {
        if (budget === "Under $20,000") {
            if (passengers === "1-2" && fuel === "Gas" && driving === "City" && vehType === "Sedan") {
                return {
                    model: "Ford Fiesta",
                    url: "https://www.ford.com/trucks/maverick/",
                    image: "https://www.google.com/imgres?q=ford%20maverick%20image&imgurl=https%3A%2F%2Fdi-uploads-pod41.dealerinspire.com%2Fsunriseford%2Fuploads%2F2023%2F10%2F2023-Ford-Maverick-2-1.jpg&imgrefurl=https%3A%2F%2Fwww.sunrise-ford.com%2Fthe-2023-ford-maverick-is-more-in-demand-than-ever%2F&docid=OYCUlmBwEAncbM&tbnid=NRA_5eBBxy4smM&vet=12ahUKEwjU-u7HiN6QAxUZLdAFHfZlERQQM3oECCcQAA..i&w=1000&h=667&hcb=2&ved=2ahUKEwjU-u7HiN6QAxUZLdAFHfZlERQQM3oECCcQAA
                };
            }
        }

        if (budget === "$20,000-$30,000") {
            if (passengers === "3-4" && (fuel === "Gas" || fuel === "Hybrid") && vehType === "SUV") {
                return {
                    model: "Ford Escape",
                    url: "https://www.ford.com/suvs/escape/",
                    image: "https://www.google.com/imgres?q=ford%20escape%20image&imgurl=https%3A%2F%2Fwww.assets.ford.com%2Fadobe%2Fassets%2Furn%3Aaaid%3Aaem%3Ad17d71c8-f984-449f-9f62-3eb4fd7465a9%2Fas%2F24_FRD_ESP_F2A0033_stln_elt_rprd_Elevated_Desktop_BU.webp%3Fmax-quality%3D75%26crop-names%3D1_21x9%26width%3D3840&imgrefurl=https%3A%2F%2Fwww.ford.com%2Fsuvs-crossovers%2Fescape%2F&docid=k1o6W1G5Sv-zRM&tbnid=9J1x0wzLdGj87M&vet=12ahUKEwiVwd3miN6QAxU84ckDHXflMwQQM3oECB8QAA..i&w=3758&h=1611&hcb=2&ved=2ahUKEwiVwd3miN6QAxU84ckDHXflMwQQM3oECB8QAA"
                };
            }
        }

        if (budget === "$30,000-$40,000") {
            if (passengers === "3-4" && fuel === "Gas" && driving === "Mixed Use" && vehType === "SUV") {
                return {
                    model: "Ford Bronco Sport",
                    url: "https://www.ford.com/suvs/bronco-sport/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/bronco-sport/2022/collections/21_ford_bronco_sport.png"
                };
            }
            if (passengers === "5-6" && fuel === "Gas" && driving === "Highway" && vehType === "Truck") {
                return {
                    model: "Ford F-150",
                    url: "https://www.ford.com/trucks/f150/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/trucks/f150/2022/collections/21_ford_f150.png"
                };
            }
        }

        if (budget === "$40,000+") {
            if (passengers === "5-6" && (fuel === "Gas" || fuel === "Hybrid") && vehType === "SUV") {
                return {
                    model: "Ford Explorer",
                    url: "https://www.ford.com/suvs/explorer/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/explorer/2022/collections/21_ford_explorer.png"
                };
            }
            if (passengers === "7+" && fuel === "Gas" && vehType === "SUV") {
                return {
                    model: "Ford Expedition",
                    url: "https://www.ford.com/suvs/expedition/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/expedition/2022/collections/21_ford_expedition.png"
                };
            }
            if ((passengers === "1-6") && fuel === "Electric" && vehType === "Truck") {
                return {
                    model: "Ford F-150 Lightning",
                    url: "https://www.ford.com/trucks/f150/lightning/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/trucks/f150/lightning/2022/collections/21_ford_f150_lightning.png"
                };
            }
        }

        // Electric performance option
        if (budget === "$30,000+" && passengers === "1-2" && fuel === "Electric" && vehType === "Sedan") {
            return {
                model: "Ford Mustang Mach-E",
                url: "https://www.ford.com/cars/mustang-mach-e/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/mustang-mach-e/2022/collections/21_ford_mustang_mach-e.png"
            };
        }

        // Default fallback
        return {
            model: "Ford Escape",
            url: "https://www.ford.com/suvs/escape/",
            image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2022/collections/21_ford_escape.png"
        };
    }

    const rec = recommendFord(budget, passengers, fuel, driving, vehicleType);

    // Rich response with image and button
    const response = {
        fulfillmentMessages: [
            {
                text: {
                    text: [
                        `Based on your selections:
Budget: ${budget}
Passengers: ${passengers}
Fuel: ${fuel}
Driving: ${driving}
Vehicle Type: ${vehicleType}

Recommended Vehicle: ${rec.model}`
                    ]
                }
            },
            {
                card: {
                    title: rec.model,
                    imageUri: rec.image,
                    buttons: [
                        {
                            text: "View on Ford.com",
                            postback: rec.url
                        }
                    ]
                }
            },
            {
                payload: {
                    richContent: [
                        [
                            {
                                type: "image",
                                rawUrl: "https://www.ford.com/etc/designs/ford/clientlibs/images/logos/ford-logo.png",
                                accessibilityText: "Ford Logo"
                            }
                        ]
                    ]
                }
            }
        ]
    };

    console.log("Webhook response:", rec.model);
    return res.json(response);
});

app.get('/', (req, res) => res.send("Webhook is running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
