// init-mongo.js

db = db.getSiblingDB("orders_db");

// Clear existing collections if any exist
db.users.drop();
db.restaurants.drop();
db.products.drop();
db.orders.drop();

const targetUserId = "64a40fe8d0e1f2a3b4c5d6e7";
const regularUserId = "64a40fe8d0e1f2a3b4c5d6e8";

db.users.insertMany([
    {
        _id: ObjectId(targetUserId), // Enforced as a real BSON ObjectId
        name: "Omer Rahamim",
        username: "owner", // 3-20 chars, alphanumeric/underscore
        password: "password123", // 4-20 chars
        age: 23, // Valid age between 0-130
        phoneNumber: "0521234567", // 7-15 digits
        role: "restaurantOwner", // Exactly "restaurantOwner"
        location: {
            type: "Point",
            coordinates: [34.8732, 32.0697],
            lat: 32.0697,
            lon: 34.8732,
        },
    },
    {
        _id: ObjectId(regularUserId),
        name: "Regular Customer",
        username: "customer",
        password: "password123",
        age: 25,
        phoneNumber: "0549876543",
        role: "regular",
        location: {
            type: "Point",
            coordinates: [34.7818, 32.0818],
            lat: 32.0818,
            lon: 34.7818,
        },
    },
]);

const restaurantEntries = [
    // ==========================================
    // 1. BURGER
    // ==========================================
    {
        restaurant: {
            name: "Burger and Grill",
            category: "burger",
            description:
                "The best premium burgers in town made from 100 percent fresh ingredients",
            phoneNumber: "031234567",
            userOwner: targetUserId,
            location: {
                lat: 32.0697,
                lon: 34.8732,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000001"),
                name: "Classic Burger",
                price: "55.00",
                description:
                    "Premium beef patty in a toasted bun with fresh vegetables",
                ingredients: ["Beef", "Lettuce", "Tomato", "Onion", "Pickles"],
            },
            {
                _id: ObjectId("64b000000000000000000002"),
                name: "Crispy Fries",
                price: "22.00",
                description: "Golden and crispy potato fries served hot",
                ingredients: ["Potatoes", "Vegetable Oil", "Salt"],
            },
            {
                _id: ObjectId("64b000000000000000000003"),
                name: "Double Cheddar Smash",
                price: "68.00",
                description:
                    "Two smashed beef patties layered with melted cheddar and caramelized onions",
                ingredients: [
                    "Double Beef Patty",
                    "Cheddar Cheese",
                    "Caramelized Onions",
                    "Special Sauce",
                    "Brioche Bun",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000004"),
                name: "Truffle Parmesan Fries",
                price: "28.00",
                description:
                    "Hand-cut fries tossed with aromatic truffle oil and grated aged parmesan",
                ingredients: [
                    "Potatoes",
                    "Truffle Oil",
                    "Parmesan Cheese",
                    "Parsley",
                    "Sea Salt",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000005"),
                name: "Crispy Chicken Wings",
                price: "42.00",
                description:
                    "Crispy glazed chicken wings coated in sweet and smoky BBQ sauce",
                ingredients: [
                    "Chicken Wings",
                    "Smoky BBQ Sauce",
                    "Sesame Seeds",
                    "Scallions",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "Smash & Co. Burgers",
            category: "burger",
            description:
                "Authentic American smash burgers with crispy lace edges, house pickles, and artisan buns",
            phoneNumber: "035221144",
            userOwner: targetUserId,
            location: {
                lat: 32.0833,
                lon: 34.7745,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000006"),
                name: "Oklahoma Onion Smash",
                price: "58.00",
                description:
                    "Beef smashed paper-thin with sweet onions pressed directly into the patty",
                ingredients: [
                    "Prime Beef",
                    "Thinly Sliced Sweet Onions",
                    "American Cheese",
                    "Potato Bun",
                    "Mustard",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000007"),
                name: "Spicy Jalapeno Bacon Burger",
                price: "64.00",
                description:
                    "A fiery smash burger loaded with smoky beef bacon and spicy pickled jalapenos",
                ingredients: [
                    "Beef Patty",
                    "Smoked Beef Bacon",
                    "Pickled Jalapenos",
                    "Chipotle Mayo",
                    "Pepper Jack Cheese",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000008"),
                name: "Beer Battered Onion Rings",
                price: "26.00",
                description:
                    "Crispy thick-cut sweet onion rings fried to perfection in craft beer batter",
                ingredients: [
                    "Sweet Yellow Onions",
                    "Craft Beer Batter",
                    "Paprika",
                    "Garlic Aioli",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000009"),
                name: "Loaded Cheese Fries",
                price: "34.00",
                description:
                    "Crispy golden fries drenched in warm house cheddar cheese sauce",
                ingredients: [
                    "Fries",
                    "Cheddar Sauce",
                    "Beef Bacon Bits",
                    "Green Onions",
                    "Jalapenos",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000010"),
                name: "Vanilla Bean Shake",
                price: "24.00",
                description:
                    "Thick and creamy classic milkshake made with real Madagascar vanilla beans",
                ingredients: [
                    "Vanilla Bean Ice Cream",
                    "Whole Milk",
                    "Whipped Cream",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "The Prime Patty",
            category: "burger",
            description:
                "Chef-crafted gourmet steakhouse burgers made from dry-aged Black Angus beef cuts",
            phoneNumber: "036128899",
            userOwner: targetUserId,
            location: {
                lat: 32.0841,
                lon: 34.8142,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000011"),
                name: "Dry-Aged Wagyu Burger",
                price: "78.00",
                description:
                    "220g dry-aged Wagyu patty topped with sauteed portobello and house truffle aioli",
                ingredients: [
                    "Dry-Aged Wagyu Beef",
                    "Brioche Bun",
                    "Arugula",
                    "Truffle Aioli",
                    "Portobello Mushroom",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000012"),
                name: "Smoked Brisket Burger",
                price: "72.00",
                description:
                    "A towering burger stacked with our 14-hour smoked brisket and crispy shallots",
                ingredients: [
                    "Beef Patty",
                    "Slow-Smoked Pulled Brisket",
                    "BBQ Glaze",
                    "Crispy Shallots",
                    "Coleslaw",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000013"),
                name: "Sweet Potato Fries",
                price: "26.00",
                description:
                    "Thin and crispy sweet potato fries with a sweet chili dipping sauce",
                ingredients: [
                    "Sweet Potatoes",
                    "Sea Salt",
                    "Sweet Chili Mayo",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000014"),
                name: "Mac & Cheese Bites",
                price: "32.00",
                description:
                    "Golden fried bite-sized mac and cheese balls with melted gooey center",
                ingredients: [
                    "Macaroni",
                    "Cheddar",
                    "Gouda",
                    "Breadcrumbs",
                    "Spicy Aioli",
                ],
            },
        ],
    },

    // ==========================================
    // 2. ITALIAN
    // ==========================================
    {
        restaurant: {
            name: "Trattoria Da Luigi",
            category: "italian",
            description:
                "Authentic Roman trattoria featuring handmade pasta extruded daily and wood-fired recipes",
            phoneNumber: "035612345",
            userOwner: targetUserId,
            location: {
                lat: 32.063,
                lon: 34.775,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000015"),
                name: "Pasta Carbonara Tradizionale",
                price: "64.00",
                description:
                    "Classic Roman carbonara made strictly with cured guanciale and aged Pecorino Romano",
                ingredients: [
                    "Spaghetti",
                    "Guanciale",
                    "Egg Yolks",
                    "Pecorino Romano",
                    "Black Pepper",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000016"),
                name: "Cacio e Pepe",
                price: "58.00",
                description:
                    "Silky Roman emulsion of melted Pecorino cheese and fragrant toasted black pepper",
                ingredients: [
                    "Tonnarelli Pasta",
                    "Pecorino Romano",
                    "Cracked Black Peppercorns",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000017"),
                name: "Burrata Pugliese",
                price: "48.00",
                description:
                    "Creamy imported burrata served over heirloom tomatoes with aged Modena balsamic glaze",
                ingredients: [
                    "Fresh Burrata",
                    "Cherry Tomatoes",
                    "Balsamic Glaze",
                    "Basil Pesto",
                    "Focaccia",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000018"),
                name: "Tiramisu Classico",
                price: "36.00",
                description:
                    "Traditional Italian dessert soaked in rich espresso with velvety mascarpone",
                ingredients: [
                    "Savoiardi Ladyfingers",
                    "Espresso",
                    "Mascarpone Cream",
                    "Cocoa Powder",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000019"),
                name: "Rosemary Garlic Focaccia",
                price: "24.00",
                description:
                    "Warm oven-baked focaccia drizzled with Tuscan olive oil and fresh rosemary",
                ingredients: [
                    "Flour",
                    "Yeast",
                    "Extra Virgin Olive Oil",
                    "Fresh Rosemary",
                    "Sea Salt",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "Pasta & Basta Fresca",
            category: "italian",
            description:
                "Fresh homemade pasta bar with rich slow-cooked sauces and artisanal Italian specialties",
            phoneNumber: "036987112",
            userOwner: targetUserId,
            location: {
                lat: 32.0713,
                lon: 34.7874,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000020"),
                name: "Truffle Tagliatelle",
                price: "72.00",
                description:
                    "Silky handmade ribbon pasta coated in an aromatic black truffle butter emulsion",
                ingredients: [
                    "Fresh Tagliatelle",
                    "Black Truffle Cream",
                    "Butter",
                    "Parmigiano-Reggiano",
                    "Thyme",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000021"),
                name: "Pappardelle Bolognese",
                price: "68.00",
                description:
                    "Wide egg ribbons with rich 6-hour simmered beef and veal bolognese ragu",
                ingredients: [
                    "Pappardelle",
                    "Beef & Veal Ragu",
                    "Red Wine",
                    "San Marzano Tomatoes",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000022"),
                name: "Gnocchi Quattro Formaggi",
                price: "62.00",
                description:
                    "Pillow-soft potato gnocchi baked in a decadent four-cheese cream sauce",
                ingredients: [
                    "Potato Gnocchi",
                    "Gorgonzola",
                    "Fontina",
                    "Parmesan",
                    "Mozzarella",
                    "Walnuts",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000023"),
                name: "Caprese Salad",
                price: "44.00",
                description:
                    "Slices of fresh buffalo mozzarella and ripe summer tomatoes garnished with fresh basil",
                ingredients: [
                    "Buffalo Mozzarella",
                    "Ripe Tomatoes",
                    "Basil Leaves",
                    "Extra Virgin Olive Oil",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000024"),
                name: "Panna Cotta al Caramello",
                price: "32.00",
                description:
                    "Silky cooked cream dessert topped with salted caramel drizzle and toasted hazelnuts",
                ingredients: [
                    "Heavy Cream",
                    "Vanilla",
                    "Salted Caramel",
                    "Roasted Hazelnuts",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "Osteria Napoli",
            category: "italian",
            description:
                "Neapolitan pizzeria and coastal Italian kitchen baking in a 450-degree Stefano Ferrara oven",
            phoneNumber: "037324567",
            userOwner: targetUserId,
            location: {
                lat: 32.0734,
                lon: 34.8112,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000025"),
                name: "Pizza Margherita D.O.P.",
                price: "56.00",
                description:
                    "The gold standard of Neapolitan pizza with blistered airy crust and melted mozzarella",
                ingredients: [
                    "Neapolitan Dough",
                    "San Marzano Tomatoes",
                    "Fior di Latte",
                    "Fresh Basil",
                    "Olive Oil",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000026"),
                name: "Pizza Diavola",
                price: "66.00",
                description:
                    "Neapolitan pizza topped with spicy cured beef pepperoni and fiery chili flakes",
                ingredients: [
                    "San Marzano Tomatoes",
                    "Spicy Beef Pepperoni",
                    "Fior di Latte",
                    "Chili Flakes",
                    "Oregano",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000027"),
                name: "Funghi & Tartufo Pizza",
                price: "69.00",
                description:
                    "White base pizza with sauteed wild mushrooms, fontina cheese, and truffle essence",
                ingredients: [
                    "White Sauce",
                    "Wild Forest Mushrooms",
                    "Mozzarella",
                    "Truffle Oil",
                    "Thyme",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000028"),
                name: "Arancini Siciliani",
                price: "38.00",
                description:
                    "Golden fried saffron risotto spheres with an oozing mozzarella center",
                ingredients: [
                    "Arborio Rice",
                    "Saffron",
                    "Mozzarella Core",
                    "Marinara Sauce",
                    "Breadcrumbs",
                ],
            },
        ],
    },

    // ==========================================
    // 3. SUSHI
    // ==========================================
    {
        restaurant: {
            name: "Sakura Sushi Bar",
            category: "sushi",
            description:
                "Contemporary Japanese sushi dining serving ultra-fresh sashimi, specialty rolls, and gyoza",
            phoneNumber: "036224455",
            userOwner: targetUserId,
            location: {
                lat: 32.0818,
                lon: 34.7818,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000029"),
                name: "Salmon Lover Roll",
                price: "54.00",
                description:
                    "Inside-out sushi roll packed with salmon and avocado, topped with seared salmon",
                ingredients: [
                    "Fresh Atlantic Salmon",
                    "Avocado",
                    "Cucumber",
                    "Spicy Mayo",
                    "Tobiko",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000030"),
                name: "Spicy Tuna Crunch",
                price: "56.00",
                description:
                    "Freshly minced spicy tuna paired with crisp cucumber and crunchy tempura flakes",
                ingredients: [
                    "Yellowfin Tuna",
                    "Chili Oil",
                    "Cucumber",
                    "Tempura Flakes",
                    "Sweet Soy Sauce",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000031"),
                name: "Rainbow Dragon Roll",
                price: "64.00",
                description:
                    "A spectacular roll wrapped in alternating slices of fresh tuna, salmon, and creamy avocado",
                ingredients: [
                    "Salmon",
                    "Tuna",
                    "Avocado",
                    "Cucumber",
                    "Unagi Sauce",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000032"),
                name: "Steamed Chicken Gyoza",
                price: "36.00",
                description:
                    "Pan-seared and steamed Japanese dumplings served with citrusy ponzu sauce",
                ingredients: [
                    "Minced Chicken",
                    "Cabbage",
                    "Ginger",
                    "Sesame Oil",
                    "Ponzu Sauce",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000033"),
                name: "Edamame with Sea Salt",
                price: "22.00",
                description:
                    "Steamed tender green soybeans in pods dusted with natural sea salt flakes",
                ingredients: [
                    "Steamed Soybeans",
                    "Coarse Sea Salt",
                    "Lemon Wedge",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000034"),
                name: "Miso Soup",
                price: "18.00",
                description:
                    "Traditional comforting Japanese broth with soft tofu cubes and fresh scallions",
                ingredients: [
                    "Fermented Soybean Paste",
                    "Silken Tofu",
                    "Wakame Seaweed",
                    "Scallions",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "Tokyo Tokyo Izakaya",
            category: "sushi",
            description:
                "Lively Tokyo-style gastropub and sushi house with vibrant rolls and sizzling robata skewers",
            phoneNumber: "035298833",
            userOwner: targetUserId,
            location: {
                lat: 32.0833,
                lon: 34.7745,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000035"),
                name: "Crispy Rice Spicy Salmon",
                price: "48.00",
                description:
                    "Golden crispy fried rice cubes crowned with spicy salmon tartare and jalapeno",
                ingredients: [
                    "Pan-Crisped Sushi Rice",
                    "Spicy Salmon Tartare",
                    "Jalapeno Slices",
                    "Sweet Unagi Glaze",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000036"),
                name: "Yellowtail Jalapeno Sashimi",
                price: "62.00",
                description:
                    "Delicately sliced sashimi-grade yellowtail dressed in tangy yuzu-citrus sauce",
                ingredients: [
                    "Hamachi Yellowtail",
                    "Serrano Pepper",
                    "Yuzu Soy Sauce",
                    "Cilantro",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000037"),
                name: "Tempura Crunch Roll",
                price: "52.00",
                description:
                    "Crunchy tempura flakes with avocado wrapped in nori and toasted sesame",
                ingredients: [
                    "Crispy Tempura",
                    "Avocado",
                    "Teriyaki Sauce",
                    "Sesame Seeds",
                    "Nori",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000038"),
                name: "Vegetable Spring Rolls",
                price: "32.00",
                description:
                    "Golden crispy spring rolls stuffed with shredded vegetables and glass noodles",
                ingredients: [
                    "Rice Paper",
                    "Carrots",
                    "Cabbage",
                    "Glass Noodles",
                    "Sweet Chili Dip",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "Zen Omakase House",
            category: "sushi",
            description:
                "Artisanal sushi bar emphasizing traditional Edomae cutting techniques and pristine sea produce",
            phoneNumber: "037512299",
            userOwner: targetUserId,
            location: {
                lat: 32.0841,
                lon: 34.8142,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000039"),
                name: "Nigiri Master Platter",
                price: "88.00",
                description:
                    "Chef selection of 8 handcrafted nigiri showcasing prime cuts of fresh sea fish",
                ingredients: [
                    "Salmon Nigiri",
                    "Tuna Nigiri",
                    "Sea Bass Nigiri",
                    "Sushi Rice",
                    "Wasabi",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000040"),
                name: "Truffle Salmon Roll",
                price: "59.00",
                description:
                    "Flame-torched salmon roll infused with aromatic white truffle oil and roasted sesame",
                ingredients: [
                    "Salmon",
                    "Avocado",
                    "Asparagus",
                    "Truffle Oil",
                    "Black Sesame",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000041"),
                name: "Tuna Tataki",
                price: "58.00",
                description:
                    "Lightly seared sesame-crusted tuna slices served over pickled daikon and ginger ponzu",
                ingredients: [
                    "Seared Ahi Tuna",
                    "Sesame Crust",
                    "Ginger Ponzu",
                    "Daikon Radish",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000042"),
                name: "Wakame Seaweed Salad",
                price: "28.00",
                description:
                    "Refreshing marinated green seaweed salad tossed in sesame-rice vinegar dressing",
                ingredients: [
                    "Wakame Seaweed",
                    "Cucumber Ribbons",
                    "Sesame Vinaigrette",
                    "Toasted Seeds",
                ],
            },
        ],
    },

    // ==========================================
    // 4. VEGAN
    // ==========================================
    {
        restaurant: {
            name: "Green Garden Kitchen",
            category: "vegan",
            description:
                "100 percent plant-based culinary bistro cooking with seasonal organic vegetables and grains",
            phoneNumber: "035189922",
            userOwner: targetUserId,
            location: {
                lat: 32.0573,
                lon: 34.7705,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000043"),
                name: "Buddha Nourish Bowl",
                price: "52.00",
                description:
                    "Warm nutrient-dense bowl filled with roasted veggies, seasoned chickpeas, and rich sesame tahini",
                ingredients: [
                    "Quinoa",
                    "Roasted Sweet Potato",
                    "Chickpeas",
                    "Kale",
                    "Avocado",
                    "Tahini Dressing",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000044"),
                name: "Beyond Mushroom Burger",
                price: "58.00",
                description:
                    "Juicy plant-based patty smothered with caramelized mushrooms and melty vegan cheddar",
                ingredients: [
                    "Plant-Based Patty",
                    "Portobello Mushrooms",
                    "Vegan Cheddar",
                    "Sprouted Bun",
                    "Garlic Mayo",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000045"),
                name: "Crispy Cauliflower Wings",
                price: "38.00",
                description:
                    "Battered crunchy cauliflower bites tossed in tangy buffalo sauce with house vegan ranch",
                ingredients: [
                    "Cauliflower Florets",
                    "Buffalo Glaze",
                    "Almond Ranch Dip",
                    "Celery",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000046"),
                name: "Sweet Potato Lentil Dahl",
                price: "46.00",
                description:
                    "Creamy aromatic Indian lentil curry simmered in rich coconut milk with jasmine rice",
                ingredients: [
                    "Red Lentils",
                    "Coconut Milk",
                    "Spinach",
                    "Turmeric",
                    "Cumin",
                    "Basmati Rice",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000047"),
                name: "Raw Vegan Chocolate Tart",
                price: "32.00",
                description:
                    "Decadent gluten-free dark chocolate tart made with organic raw cocoa and date-walnut crust",
                ingredients: [
                    "Medjool Dates",
                    "Raw Cocoa",
                    "Walnuts",
                    "Coconut Cream",
                    "Sea Salt",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "The Vegan Table",
            category: "vegan",
            description:
                "Mediterranean plant-forward sanctuary serving hearty salads, dips, and wood-baked pastries",
            phoneNumber: "036814477",
            userOwner: targetUserId,
            location: {
                lat: 32.063,
                lon: 34.775,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000048"),
                name: "Falafel Deluxe Platter",
                price: "42.00",
                description:
                    "Crispy freshly fried green herb falafel balls served with creamy warm hummus and pita",
                ingredients: [
                    "Green Herb Falafel",
                    "Hummus",
                    "Israeli Salad",
                    "Tahini",
                    "Warm Pita",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000049"),
                name: "Smoked Eggplant Carpaccio",
                price: "38.00",
                description:
                    "Fire-roasted eggplant carpaccio drizzled with raw stone-ground tahini and sweet silan",
                ingredients: [
                    "Charred Eggplant",
                    "Raw Tahini",
                    "Pomegranate Seeds",
                    "Date Molasses",
                    "Pine Nuts",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000050"),
                name: "Oat Milk Matcha Latte",
                price: "18.00",
                description:
                    "Smooth ceremonial Japanese green tea latte whisked with steamed barista oat milk",
                ingredients: [
                    "Ceremonial Grade Matcha",
                    "Steamed Oat Milk",
                    "Vanilla",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000051"),
                name: "Acai Energy Bowl",
                price: "36.00",
                description:
                    "Thick antioxidant-packed frozen acai blend topped with crunchy granola and fresh fruit",
                ingredients: [
                    "Organic Acai Puree",
                    "Banana",
                    "Granola",
                    "Chia Seeds",
                    "Fresh Berries",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "Botanica Plant Deli",
            category: "vegan",
            description:
                "Neighborhood plant deli offering wholesome sandwich stacks, vibrant bowls, and cold juices",
            phoneNumber: "037123300",
            userOwner: targetUserId,
            location: {
                lat: 32.0594,
                lon: 34.8619,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000052"),
                name: "Avocado Sourdough Toast",
                price: "36.00",
                description:
                    "Toasted country sourdough topped with creamy seasoned avocado and pickled radishes",
                ingredients: [
                    "Artisan Sourdough",
                    "Smashed Hass Avocado",
                    "Radish",
                    "Hemp Seeds",
                    "Chili Flakes",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000053"),
                name: "Tofu Poke Power Bowl",
                price: "49.00",
                description:
                    "Savory cubed tofu tossed in ginger tamari glaze over brown rice with fresh vegetables",
                ingredients: [
                    "Marinated Organic Tofu",
                    "Brown Rice",
                    "Edamame",
                    "Cucumbers",
                    "Ginger Sesame Dressing",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000054"),
                name: "Fresh Cold-Pressed Green Juice",
                price: "22.00",
                description:
                    "Refreshing raw cold-pressed elixir bursting with vitamins and natural vitality",
                ingredients: [
                    "Green Apple",
                    "Kale",
                    "Cucumber",
                    "Celery",
                    "Lemon",
                    "Ginger",
                ],
            },
        ],
    },

    // ==========================================
    // 5. BBQ & GRILL
    // ==========================================
    {
        restaurant: {
            name: "Texas Smokehouse BBQ",
            category: "bbq",
            description:
                "Authentic low-and-slow Texas pit barbecue smoked over local hickory and oak woods",
            phoneNumber: "039241155",
            userOwner: targetUserId,
            location: {
                lat: 32.0886,
                lon: 34.858,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000055"),
                name: "Smoked Texas Beef Brisket",
                price: "76.00",
                description:
                    "Tender beef brisket smoked low and slow for 14 hours until melt-in-your-mouth tender",
                ingredients: [
                    "Hickory Smoked Beef Brisket",
                    "House Spice Rub",
                    "Pickled Onions",
                    "Cornbread",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000056"),
                name: "Smoked Pulled Beef Sandwich",
                price: "62.00",
                description:
                    "Heaped mound of succulent pulled beef drenched in barbecue sauce inside a brioche bun",
                ingredients: [
                    "Slow Cooked Pulled Beef",
                    "Brioche Bun",
                    "Tangy Coleslaw",
                    "Smoky BBQ Sauce",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000057"),
                name: "Crispy BBQ Half Chicken",
                price: "65.00",
                description:
                    "Juicy wood-smoked half chicken with a caramelized sweet and savory barbecue crust",
                ingredients: [
                    "Free-Range Chicken",
                    "Sweet Brown Sugar Glaze",
                    "Rosemary",
                    "Garlic Butter",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000058"),
                name: "Skillet Cornbread",
                price: "22.00",
                description:
                    "Warm Southern-style sweet cornbread baked in a cast-iron skillet with honey butter",
                ingredients: [
                    "Cornmeal",
                    "Butter",
                    "Honey",
                    "Jalapeno Bits",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000059"),
                name: "Creamy BBQ Macaroni Salad",
                price: "20.00",
                description:
                    "Chilled traditional barbecue side salad with diced crunchy vegetables",
                ingredients: [
                    "Elbow Macaroni",
                    "Sweet Pickles",
                    "Carrots",
                    "Creamy Dressing",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "Charcoal & Oak",
            category: "bbq",
            description:
                "Premium wood-fired grill bar specialized in dry-aged steak skewers and ember-roasted delicacies",
            phoneNumber: "035447788",
            userOwner: targetUserId,
            location: {
                lat: 32.0833,
                lon: 34.7745,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000060"),
                name: "Sirloin Steak Skewers",
                price: "74.00",
                description:
                    "Prime aged sirloin cubes grilled over open lump charcoal with fresh herb chimichurri",
                ingredients: [
                    "Aged Beef Sirloin",
                    "Bell Peppers",
                    "Red Onions",
                    "Chimichurri Glaze",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000061"),
                name: "Lamb Kofta Kebab",
                price: "66.00",
                description:
                    "Charcoal-grilled spiced lamb kebabs served over velvety tahini with roasted peppers",
                ingredients: [
                    "Spiced Minced Lamb",
                    "Pine Nuts",
                    "Parsley",
                    "Tahini",
                    "Grilled Tomatoes",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000062"),
                name: "Ember-Roasted Sweet Potato",
                price: "26.00",
                description:
                    "Whole sweet potato roasted directly on hot embers until caramelized and velvety",
                ingredients: [
                    "Whole Sweet Potato",
                    "Coarse Salt",
                    "Olive Oil",
                    "Crumbled Feta",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000063"),
                name: "Charred Corn on the Cob",
                price: "22.00",
                description:
                    "Sweet corn on the cob charred on the grill and brushed with zesty spiced butter",
                ingredients: [
                    "Sweet Corn",
                    "Spicy Chipotle Butter",
                    "Lime",
                    "Smoked Paprika",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "The Smoked Ribs Joint",
            category: "bbq",
            description:
                "Craft barbecue joint obsessed with falling-off-the-bone meats, house glazes, and comfort sides",
            phoneNumber: "035310022",
            userOwner: targetUserId,
            location: {
                lat: 32.078,
                lon: 34.848,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000064"),
                name: "Smoked Beef Short Ribs",
                price: "89.00",
                description:
                    "Colossal beef rib with a deep bark and smoke ring, smoked over oak for 10 hours",
                ingredients: [
                    "Prime Beef Short Rib",
                    "Black Pepper Rub",
                    "Apple Cider Vinegar Spritz",
                    "Pickles",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000065"),
                name: "Loaded Pulled Beef Fries",
                price: "46.00",
                description:
                    "Golden fries piled high with slow-cooked shredded beef and melted aged cheddar",
                ingredients: [
                    "Crispy Fries",
                    "Pulled Beef",
                    "Cheddar Melt",
                    "BBQ Sauce",
                    "Crispy Onions",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000066"),
                name: "Crispy Onion Straws",
                price: "24.00",
                description:
                    "Feather-light crispy fried onion curls served with zesty horseradish dipping sauce",
                ingredients: [
                    "Thin Cut Onions",
                    "Spiced Flour",
                    "Creamy Horseradish Dip",
                ],
            },
        ],
    },

    // ==========================================
    // 6. CAFE
    // ==========================================
    {
        restaurant: {
            name: "Artisan Coffee Roasters",
            category: "cafe",
            description:
                "Specialty third-wave micro-roastery preparing single-origin espresso and fresh artisan pastries",
            phoneNumber: "035623344",
            userOwner: targetUserId,
            location: {
                lat: 32.063,
                lon: 34.775,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000067"),
                name: "Specialty Flat White",
                price: "16.00",
                description:
                    "Rich double shot of Ethiopian espresso with silky, velvety textured microfoam",
                ingredients: [
                    "Double Espresso Blend",
                    "Steamed Microfoam Milk",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000068"),
                name: "Cold Brew Reserve",
                price: "18.00",
                description:
                    "Slow-steeped 18-hour cold brew coffee with chocolate and fruit tasting notes",
                ingredients: [
                    "Colombian Single Origin Coffee",
                    "Filtered Water",
                    "Ice",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000069"),
                name: "Almond Croissant",
                price: "22.00",
                description:
                    "Flaky French butter croissant filled with sweet frangipane and topped with crunchy almonds",
                ingredients: [
                    "Flaky Pastry Dough",
                    "Frangipane Almond Cream",
                    "Toasted Sliced Almonds",
                    "Powdered Sugar",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000070"),
                name: "Banana Bread Slice",
                price: "19.00",
                description:
                    "Warm toasted slice of moist homemade banana walnut bread with dark chocolate swirls",
                ingredients: [
                    "Ripe Bananas",
                    "Walnuts",
                    "Dark Chocolate Chips",
                    "Cinnamon",
                    "Butter",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000071"),
                name: "Matcha Cream Brioche",
                price: "24.00",
                description:
                    "Golden soft brioche bun piped with rich Japanese matcha pastry cream",
                ingredients: [
                    "Brioche Dough",
                    "Japanese Matcha Custard",
                    "Sugar Glaze",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "Cafe Bella Vista",
            category: "cafe",
            description:
                "Charming neighborhood European cafe featuring breakfast platters, espresso, and sweet tarts",
            phoneNumber: "035109988",
            userOwner: targetUserId,
            location: {
                lat: 32.0573,
                lon: 34.7705,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000072"),
                name: "Eggs Benedict Brioche",
                price: "54.00",
                description:
                    "Two perfectly poached eggs and smoked salmon on brioche blanketed in rich hollandaise",
                ingredients: [
                    "Toasted Brioche",
                    "Poached Farm Eggs",
                    "Hollandaise Sauce",
                    "Smoked Salmon",
                    "Chives",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000073"),
                name: "Belgian Waffle Tower",
                price: "46.00",
                description:
                    "Crisp golden waffles served warm with seasonal berries and authentic maple syrup",
                ingredients: [
                    "Belgian Waffles",
                    "Fresh Strawberries",
                    "Whipped Cream",
                    "Maple Syrup",
                    "Nutella",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000074"),
                name: "Iced Caramel Macchiato",
                price: "20.00",
                description:
                    "Chilled espresso layered over fresh milk, sweetened vanilla, and buttery caramel",
                ingredients: [
                    "Espresso",
                    "Milk",
                    "Vanilla Syrup",
                    "Caramel Drizzle",
                    "Ice",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000075"),
                name: "Classic Cheesecake",
                price: "34.00",
                description:
                    "Dense and creamy New York-style baked cheesecake with graham cracker crust",
                ingredients: [
                    "Cream Cheese",
                    "Graham Cracker Crust",
                    "Sour Cream Glaze",
                    "Vanilla",
                ],
            },
        ],
    },
    {
        restaurant: {
            name: "The Daily Grind Espresso",
            category: "cafe",
            description:
                "Urban espresso haven serving morning power bowls, gourmet sandwiches, and specialty brews",
            phoneNumber: "039314422",
            userOwner: targetUserId,
            location: {
                lat: 32.0886,
                lon: 34.858,
            },
        },
        products: [
            {
                _id: ObjectId("64b000000000000000000076"),
                name: "Caprese Ciabatta Panini",
                price: "38.00",
                description:
                    "Crispy pressed Italian ciabatta filled with melted mozzarella, pesto, and ripe tomatoes",
                ingredients: [
                    "Artisan Ciabatta",
                    "Fresh Mozzarella",
                    "Roma Tomatoes",
                    "Basil Pesto",
                    "Arugula",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000077"),
                name: "Turkey Cranberry Bagel",
                price: "42.00",
                description:
                    "Warm toasted bagel layered with savory smoked turkey, cream cheese, and sweet cranberries",
                ingredients: [
                    "Toasted Sesame Bagel",
                    "Smoked Turkey Breast",
                    "Cranberry Chutney",
                    "Cream Cheese",
                    "Spinach",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000078"),
                name: "Spanish Iced Cortado",
                price: "17.00",
                description:
                    "Equal parts robust espresso and sweet condensed milk poured over chilled ice",
                ingredients: [
                    "Espresso Shot",
                    "Condensed Milk",
                    "Cold Whole Milk",
                    "Ice",
                ],
            },
            {
                _id: ObjectId("64b000000000000000000079"),
                name: "Blueberry Streusel Muffin",
                price: "18.00",
                description:
                    "Jumbo bakery muffin loaded with wild blueberries and crowned with cinnamon streusel",
                ingredients: [
                    "Fresh Blueberries",
                    "Flour",
                    "Butter",
                    "Cinnamon Streusel Crumb",
                ],
            },
        ],
    },
];

// Iterate and insert each restaurant and its associated products
for (const entry of restaurantEntries) {
    const restaurantResult = db.restaurants.insertOne(entry.restaurant);
    const generatedRestId = restaurantResult.insertedId.valueOf().toString();

    const productsToInsert = entry.products.map((p) => ({
        ...p,
        restaurantId: generatedRestId,
    }));

    db.products.insertMany(productsToInsert);
}
