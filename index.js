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
    // 1️⃣ Budget under $20k → Recommend used car
    if (budget === "Under $20,000") {
        return {
            model: "Used Ford Vehicle",
            description: "For budgets under $20,000, consider purchasing a certified pre-owned Ford. You can find reliable used Escapes, Fusions, or Mavericks at your local Ford dealer.",
            url: "https://www.fordblueadvantage.com/",
            image: "https://www.fordblueadvantage.com/content/dam/ford/blueadvantage/hero/ford-blue-advantage-certified-used.jpg"
        };
    }

    // 2️⃣ $20,000–$30,000 → Escape, Maverick, or Fusion Hybrid
    if (budget === "$20,000-$30,000") {
        if (vehType === "SUV" && (fuel === "Gas" || fuel === "Hybrid")) {
            return {
                model: "Ford Escape",
                description: "A compact SUV with seating for 5, strong fuel economy (up to 41 MPG), and great safety features—perfect for city or family use.",
                url: "https://www.ford.com/suvs/escape/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
            };
        }
        if (vehType === "Truck") {
            return {
                model: "Ford Maverick",
                description: "A compact truck offering up to 37 MPG and a 4,000 lb towing capacity. Ideal for those who want cargo flexibility and efficiency.",
                url: "https://www.ford.com/trucks/maverick/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/trucks/maverick/2025/collections/25_ford_maverick.png"
            };
        }
        if (vehType === "Sedan" && fuel === "Hybrid") {
            return {
                model: "Ford Fusion Hybrid",
                description: "An efficient midsize sedan with 47 MPG and Ford Co-Pilot360™ safety features. Great for rideshare drivers or city commuting.",
                url: "https://www.ford.com/cars/fusion/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/cars/fusion/2020/collections/20_ford_fusion_hybrid.png"
            };
        }
    }

    // 3️⃣ $30,000–$40,000 → Bronco Sport or Mustang Mach-E (base trims)
    if (budget === "$30,000-$40,000") {
        if (vehType === "SUV" && driving === "Adventure") {
            return {
                model: "Ford Bronco Sport",
                description: "A compact SUV designed for adventure, with AWD and great off-road capability—perfect for active lifestyles.",
                url: "https://www.ford.com/suvs/bronco-sport/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/bronco-sport/2025/collections/25_ford_bronco_sport.png"
            };
        }
        if (fuel === "Electric" && vehType === "SUV") {
            return {
                model: "Ford Mustang Mach-E",
                description: "A fully electric premium SUV with up to 480 horsepower and zero emissions. Great mix of power, comfort, and sustainability.",
                url: "https://www.ford.com/suvs/mach-e/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/mach-e/2025/collections/25_ford_mustang_mach-e.png"
            };
        }
    }

    // 4️⃣ $40,000+ → Explorer or higher Mach-E trims
    if (budget === "$40,000+") {
        if (vehType === "SUV" && passengers === "5-7") {
            return {
                model: "Ford Explorer",
                description: "A spacious three-row SUV with up to 400 horsepower, AWD, and top safety features—ideal for families or group transport.",
                url: "https://www.ford.com/suvs/explorer/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/explorer/2025/collections/25_ford_explorer.png"
            };
        }
        if (fuel === "Electric" && vehType === "SUV") {
            return {
                model: "Ford Mustang Mach-E (Premium Trim)",
                description: "An upgraded all-electric SUV delivering high performance, long range, and cutting-edge tech for premium comfort.",
                url: "https://www.ford.com/suvs/mach-e/",
                image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/mach-e/2025/collections/25_ford_mustang_mach-e.png"
            };
        }
    }

    // 5️⃣ Default fallback
    return {
        model: "Ford Escape",
        description: "A reliable, versatile SUV perfect for most drivers. Available in both hybrid and gasoline models.",
        url: "https://www.ford.com/suvs/escape/",
        image: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/suvs/escape/2025/collections/25_ford_escape.png"
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
