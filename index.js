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
    const passengers = getParam('PassengerCounts');
    const fuel = getParam('FuelPreferences');
    const driving = getParam('DrivingTypes');
    const vehicleType = getParam('VehicleTypes');

    // Decision logic
    function recommendFord(budget, passengers, fuel, driving, vehType) {
        if (budget === "Under $20,000") {
            if (passengers === "1-2" && fuel === "Gas" && driving === "City" && vehType === "Sedan") {
                return {
                    model: "Ford Fiesta",
                    description: "Perfect for city driving with excellent fuel economy",
                    url: "https://www.ford.com/cars/fiesta/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/fiesta/2022/collections/21_ford_fiesta.png"
                };
            }
        }

        if (budget === "$20,000-$30,000") {
            if (passengers === "3-4" && (fuel === "Gas" || fuel === "Hybrid") && vehType === "SUV") {
                return {
                    model: "Ford Escape",
                    description: "Versatile SUV with available hybrid option for efficient family transport",
                    url: "https://www.ford.com/suvs/escape/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2022/collections/21_ford_escape.png"
                };
            }
        }

        if (budget === "$30,000-$40,000") {
            if (passengers === "3-4" && fuel === "Gas" && driving === "Mixed Use" && vehType === "SUV") {
                return {
                    model: "Ford Bronco Sport",
                    description: "Adventure-ready SUV built for both city streets and off-road trails",
                    url: "https://www.ford.com/suvs/bronco-sport/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/bronco-sport/2022/collections/21_ford_bronco_sport.png"
                };
            }
            if (passengers === "5-6" && fuel === "Gas" && driving === "Highway" && vehType === "Truck") {
                return {
                    model: "Ford F-150",
                    description: "America's best-selling truck with legendary capability and comfort",
                    url: "https://www.ford.com/trucks/f150/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/trucks/f150/2022/collections/21_ford_f150.png"
                };
            }
        }

        if (budget === "$40,000+") {
            if (passengers === "5-6" && (fuel === "Gas" || fuel === "Hybrid") && vehType === "SUV") {
                return {
                    model: "Ford Explorer",
                    description: "Spacious three-row SUV combining luxury with utility",
                    url: "https://www.ford.com/suvs/explorer/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/explorer/2022/collections/21_ford_explorer.png"
                };
            }
            if (passengers === "7+" && fuel === "Gas" && vehType === "SUV") {
                return {
                    model: "Ford Expedition",
                    description: "Full-size SUV with maximum passenger and cargo capacity",
                    url: "https://www.ford.com/suvs/expedition/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/expedition/2022/collections/21_ford_expedition.png"
                };
            }
            if ((passengers === "1-6") && fuel === "Electric" && vehType === "Truck") {
                return {
                    model: "Ford F-150 Lightning",
                    description: "Electric powerhouse with cutting-edge technology and zero emissions",
                    url: "https://www.ford.com/trucks/f150/lightning/",
                    image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/trucks/f150/lightning/2022/collections/21_ford_f150_lightning.png"
                };
            }
        }

        // Electric performance option
        if (budget === "$30,000+" && passengers === "1-2" && fuel === "Electric" && vehType === "Sedan") {
            return {
                model: "Ford Mustang Mach-E",
                description: "Electric performance SUV with iconic Mustang heritage",
                url: "https://www.ford.com/cars/mustang-mach-e/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/mustang-mach-e/2022/collections/21_ford_mustang_mach-e.png"
            };
        }

        // Default fallback
        return {
            model: "Ford Escape",
            description: "Versatile SUV suitable for a wide range of needs",
            url: "https://www.ford.com/suvs/escape/",
            image: {
                src: {
                    rawUrl: "https://raw.githubusercontent.com/Luke-Wojciuch/Dialog_Flow_Webhook/main/images/Ford_Escape.jpg"
  }
}

        };
    }

    const rec = recommendFord(budget, passengers, fuel, driving, vehicleType);

    // Rich response with improved formatting
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
          `🚙 Vehicle Type: ${vehicleType}\n\n`
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
                { text: "View Details", link: rec.url },
              ]
            }
          ]
        ]
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
