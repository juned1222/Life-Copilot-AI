import { CampusItem, VendorOption } from './types';

export interface CampusRecord {
  item: CampusItem;
  options: VendorOption[];
}

export const CAMPUS_DATABASE: CampusRecord[] = [
  // --- FOODS & CANTEENS ---
  {
    item: {
      id: "food-bakesamosa",
      name: "Bakesamosa",
      category: "Food",
      tags: ["bake samosa", "samosa", "snack", "manasvi foods", "acropolis canteen", "hot food", "fast food"]
    },
    options: [
      {
        vendorName: "Acropolis College Canteen (Manasvi Foods)",
        itemName: "Legendary Baked Samosa (Crispy & Hot)",
        price: 20,
        timeMins: 3,
        timeText: "3 mins walk (Canteen)",
        availability: "In Stock",
        locationInfo: "Block A Ground Floor, Manasvi Foods Canteen",
        openingHours: "8:00 AM - 5:00 PM"
      },
      {
        vendorName: "Campus B Cafe",
        itemName: "Oven Baked Samosa (Premium Cheese Filled)",
        price: 28,
        timeMins: 2,
        timeText: "2 mins walk (B Cafe)",
        availability: "Limited Stock",
        locationInfo: "Block B Central Porch Cafe",
        openingHours: "8:30 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Tapri",
        itemName: "Local Fry Samosa (Indori Style Spicy)",
        price: 15,
        timeMins: 15,
        timeText: "15 mins walk / 5 mins ride (Manglia Square)",
        availability: "In Stock",
        locationInfo: "Manglia Chouraha Local Food Corner",
        openingHours: "7:00 AM - 9:00 PM"
      },
      {
        vendorName: "Blinkit / Instamart",
        itemName: "Zudio-style Baked Samosa (Frozen Pack of 4)",
        price: 90,
        timeMins: 20,
        timeText: "20 mins delivery (to Campus Gate)",
        availability: "Fast Delivery",
        locationInfo: "Instant Delivery to Main Entrance Gate 1",
        direct_link: "https://blinkit.com/s/?q=baked+samosa"
      }
    ]
  },
  {
    item: {
      id: "food-peanutchaat",
      name: "Peanut Chaat",
      category: "Food",
      tags: ["peanut", "chaat", "healthy", "snack", "protein", "manasvi"]
    },
    options: [
      {
        vendorName: "Acropolis College Canteen (Manasvi Foods)",
        itemName: "Protein Rich Spicy Peanut Chaat",
        price: 30,
        timeMins: 3,
        timeText: "3 mins walk (Canteen)",
        availability: "In Stock",
        locationInfo: "Manasvi Foods Counter 2",
        openingHours: "8:00 AM - 5:00 PM"
      },
      {
        vendorName: "Campus B Cafe",
        itemName: "Chatpata Roasted Peanut Mixture",
        price: 35,
        timeMins: 2,
        timeText: "2 mins walk (B Cafe)",
        availability: "In Stock",
        locationInfo: "Campus B Refreshment Counter",
        openingHours: "8:30 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Tapri",
        itemName: "Indori Ghatiya Peanut Sev Mix",
        price: 20,
        timeMins: 15,
        timeText: "15 mins walk (Manglia Square)",
        availability: "In Stock",
        locationInfo: "Manglia Square Local Vendor",
        openingHours: "8:00 AM - 10:00 PM"
      }
    ]
  },
  {
    item: {
      id: "food-dalpakwan",
      name: "Dal Pakwan",
      category: "Food",
      tags: ["dal pakwan", "traditional", "heavy breakfast", "breakfast", "manasvi"]
    },
    options: [
      {
        vendorName: "Acropolis College Canteen (Manasvi Foods)",
        itemName: "Indori Dal Pakwan with Sweet Chutney",
        price: 40,
        timeMins: 4,
        timeText: "4 mins walk (Canteen)",
        availability: "In Stock",
        locationInfo: "Manasvi Foods Main Meals Section",
        openingHours: "8:30 AM - 2:00 PM (Lunch Specialist)"
      },
      {
        vendorName: "Manglia Square Local Tapri",
        itemName: "Manglia Special Crispy Dal Pakwan",
        price: 35,
        timeMins: 15,
        timeText: "15 mins walk",
        availability: "Limited Stock",
        locationInfo: "Manglia Chouraha Chacha Dal Pakwan",
        openingHours: "8:00 AM - 1:00 PM"
      }
    ]
  },
  {
    item: {
      id: "food-noodles",
      name: "Noodles",
      category: "Food",
      tags: ["noodles", "chinese", "maggie", "chowmein", "manasvi", "b cafe", "local"]
    },
    options: [
      {
        vendorName: "Acropolis College Canteen (Manasvi Foods)",
        itemName: "Schezwan Veg Noodles (Hot & Spicy)",
        price: 50,
        timeMins: 3,
        timeText: "3 mins walk (Canteen)",
        availability: "In Stock",
        locationInfo: "Manasvi Foods Chinese Corner",
        openingHours: "8:00 AM - 5:00 PM"
      },
      {
        vendorName: "Campus B Cafe",
        itemName: "Cheese Butter Masala Noodles (Maggie)",
        price: 60,
        timeMins: 2,
        timeText: "2 mins walk (B Cafe)",
        availability: "In Stock",
        locationInfo: "Block B Porch Cafe",
        openingHours: "8:30 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Tapri",
        itemName: "Yippee / Street Style Hakka Noodles",
        price: 45,
        timeMins: 15,
        timeText: "15 mins walk (Manglia Square)",
        availability: "In Stock",
        locationInfo: "Manglia Square Fast Food Tapri",
        openingHours: "11:00 AM - 9:00 PM"
      }
    ]
  },
  {
    item: {
      id: "food-coldcoffee",
      name: "Cold Coffee",
      category: "Food",
      tags: ["cold coffee", "coffee", "beverage", "drink", "chocolate", "frappe"]
    },
    options: [
      {
        vendorName: "Acropolis College Canteen (Manasvi Foods)",
        itemName: "Thick Chocolate Cold Coffee",
        price: 35,
        timeMins: 3,
        timeText: "3 mins walk (Canteen)",
        availability: "In Stock",
        locationInfo: "Manasvi Foods Juice & Shake Stall",
        openingHours: "8:00 AM - 5:00 PM"
      },
      {
        vendorName: "Campus B Cafe",
        itemName: "Whipped Cream Cold Coffee Frappé",
        price: 40,
        timeMins: 2,
        timeText: "2 mins walk (B Cafe)",
        availability: "In Stock",
        locationInfo: "Campus B Main Counter",
        openingHours: "8:30 AM - 4:30 PM"
      },
      {
        vendorName: "Blinkit / Instamart",
        itemName: "Amul Cool Cafe / Nescafe Cold Can (Pack of 2)",
        price: 70,
        timeMins: 15,
        timeText: "15 mins delivery (to Campus Gate)",
        availability: "Fast Delivery",
        locationInfo: "Instant Gate-Delivery (Call rider at gate)",
        direct_link: "https://blinkit.com/s/?q=cold+coffee"
      },
      {
        vendorName: "Manglia Square Local Tapri",
        itemName: "Simple Shaked Sweet Cold Coffee",
        price: 25,
        timeMins: 15,
        timeText: "15 mins walk",
        availability: "In Stock",
        locationInfo: "Manglia Square Durga Dairy",
        openingHours: "8:00 AM - 10:00 PM"
      }
    ]
  },
  {
    item: {
      id: "food-cheesesandwich",
      name: "Cheese Sandwich",
      category: "Food",
      tags: ["sandwich", "cheese", "grilled", "veg sandwich", "toast"]
    },
    options: [
      {
        vendorName: "Campus B Cafe",
        itemName: "Double Grilled Jumbo Cheese Veg Sandwich",
        price: 60,
        timeMins: 2,
        timeText: "2 mins walk (B Cafe)",
        availability: "In Stock",
        locationInfo: "Block B Central Porch Cafe",
        openingHours: "8:30 AM - 4:30 PM"
      },
      {
        vendorName: "Acropolis College Canteen (Manasvi Foods)",
        itemName: "Classic Grilled Veg & Mayonnaise Sandwich",
        price: 45,
        timeMins: 3,
        timeText: "3 mins walk (Canteen)",
        availability: "In Stock",
        locationInfo: "Manasvi Foods Fast Foods Section",
        openingHours: "8:00 AM - 5:00 PM"
      }
    ]
  },
  {
    item: {
      id: "food-masalachai",
      name: "Masala Chai",
      category: "Food",
      tags: ["tea", "chai", "masala chai", "cutting chai", "ginger tea", "hot beverage"]
    },
    options: [
      {
        vendorName: "Campus B Cafe",
        itemName: "Adrak Elaichi Special Tea",
        price: 15,
        timeMins: 2,
        timeText: "2 mins walk (B Cafe)",
        availability: "In Stock",
        locationInfo: "Campus B Beverage Section",
        openingHours: "8:30 AM - 4:30 PM"
      },
      {
        vendorName: "Acropolis College Canteen (Manasvi Foods)",
        itemName: "Canteen Spl Cutting Ginger Chai",
        price: 12,
        timeMins: 3,
        timeText: "3 mins walk (Canteen)",
        availability: "In Stock",
        locationInfo: "Manasvi Foods Tea Stall",
        openingHours: "8:00 AM - 5:00 PM"
      },
      {
        vendorName: "Manglia Square Local Tapri",
        itemName: "Tapri Special Kulhad Ginger Chai",
        price: 10,
        timeMins: 15,
        timeText: "15 mins walk (Manglia Square)",
        availability: "In Stock",
        locationInfo: "Manglia Square Main Crossing Tea Stall",
        openingHours: "6:00 AM - 11:00 PM"
      }
    ]
  },
  {
    item: {
      id: "food-pohajalebi",
      name: "Poha Jalebi",
      category: "Food",
      tags: ["poha", "jalebi", "breakfast", "indori poha", "indore"]
    },
    options: [
      {
        vendorName: "Acropolis College Canteen (Manasvi Foods)",
        itemName: "Nylon Sev Indori Poha & Hot Jalebi Combo",
        price: 25,
        timeMins: 3,
        timeText: "3 mins walk (Canteen)",
        availability: "In Stock",
        locationInfo: "Manasvi Foods Breakfast Counter",
        openingHours: "8:00 AM - 12:00 PM (Morning Specialty)"
      },
      {
        vendorName: "Manglia Square Local Tapri",
        itemName: "Authentic Indori Jeeravan Poha + Crispy Kesariya Jalebi",
        price: 20,
        timeMins: 15,
        timeText: "15 mins walk",
        availability: "In Stock",
        locationInfo: "Manglia Square Indore-1 Snacks",
        openingHours: "7:00 AM - 1:00 PM"
      }
    ]
  },

  // --- STATIONERY & LABS ---
  {
    item: {
      id: "stat-physicslabmanual",
      name: "Physics Lab Manual",
      category: "Stationery",
      tags: ["physics lab manual", "physics manual", "lab manual", "1st year", "engineering physics", "academic"]
    },
    options: [
      {
        vendorName: "College Stationery Shop",
        itemName: "Official AITR Physics Lab Manual (Verified Syllabus)",
        price: 80,
        timeMins: 2,
        timeText: "2 mins walk (B-Block Basement)",
        availability: "In Stock",
        locationInfo: "C-Block Ground floor near Admin Office / B-Block Basement Shop",
        openingHours: "9:00 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Shop",
        itemName: "AITR Syllabus Physics Manual Copy",
        price: 70,
        timeMins: 15,
        timeText: "15 mins walk (Manglia Square)",
        availability: "In Stock",
        locationInfo: "Mahadev Stationery, Manglia Chouraha",
        openingHours: "9:00 AM - 8:30 PM"
      },
      {
        vendorName: "Amazon",
        itemName: "Engineering Physics Practical Manual (Generalized Guidelines)",
        price: 60,
        timeMins: 2880, // 2 Days
        timeText: "1-2 Days (Amazon Online)",
        availability: "1-2 Days",
        locationInfo: "Shipped to your local hostel or home address",
        direct_link: "https://www.amazon.in/s?k=engineering+physics+lab+manual"
      }
    ]
  },
  {
    item: {
      id: "stat-drawingsheet",
      name: "Engineering Drawing Sheet",
      category: "Stationery",
      tags: ["engineering drawing sheet", "drawing sheet", "ed sheet", "drawing board", "chart papers", "ed", "graphics"]
    },
    options: [
      {
        vendorName: "College Stationery Shop",
        itemName: "Standard A1 Size Thick Drawing Sheets (AITR Logo-stamped)",
        price: 10,
        timeMins: 2,
        timeText: "2 mins walk (Basement Shop)",
        availability: "In Stock",
        locationInfo: "B-Block Basement Shop (Fast line)",
        openingHours: "9:00 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Shop",
        itemName: "Standard Drawing Sheets (Unbranded A1)",
        price: 8,
        timeMins: 15,
        timeText: "15 mins walk (Manglia Square)",
        availability: "In Stock",
        locationInfo: "Mahadev Stationery, Manglia Square",
        openingHours: "9:00 AM - 8:30 PM"
      },
      {
        vendorName: "Blinkit / Instamart",
        itemName: "Vardhaman White Chart Papers A1 (Pack of 5, delivered hot)",
        price: 45,
        timeMins: 15,
        timeText: "15 mins (Blinkit Gate Delivery)",
        availability: "Fast Delivery",
        locationInfo: "Delivered to Main entrance. Fast & convenient during submissions.",
        direct_link: "https://blinkit.com/s/?q=chart+sheets"
      },
      {
        vendorName: "Amazon",
        itemName: "Premium Cartridge Drawing Sheets A1 Size (Pack of 10)",
        price: 90,
        timeMins: 1440, // 1 Day
        timeText: "Next Day delivery (Amazon)",
        availability: "Available",
        locationInfo: "Needs advance dispatch. Includes storage tube.",
        direct_link: "https://www.amazon.in/s?k=engineering+drawing+sheets"
      }
    ]
  },
  {
    item: {
      id: "stat-a4paper",
      name: "A4 Paper Bundle",
      category: "Stationery",
      tags: ["a4 paper bundle", "a4 bundle", "a4 rim", "a4 sheets", "assignment sheet", "copier papers"]
    },
    options: [
      {
        vendorName: "College Stationery Shop",
        itemName: "JK Easy Copier A4 Paper Bundle (75GSM, 500 Sheets)",
        price: 150,
        timeMins: 2,
        timeText: "2 mins walk (Basement Shop)",
        availability: "In Stock",
        locationInfo: "B-Block Basement Stationery Shop",
        openingHours: "9:00 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Shop",
        itemName: "Spectra A4 Sheets Bundle (75GSM, 500 Sheets)",
        price: 130,
        timeMins: 15,
        timeText: "15 mins walk (Manglia)",
        availability: "In Stock",
        locationInfo: "Local Bazaar Book Stall",
        openingHours: "9:00 AM - 9:00 PM"
      },
      {
        vendorName: "Amazon",
        itemName: "Amazon Brand - Solimo A4 Copier Papers (500 sheets)",
        price: 110,
        timeMins: 1440,
        timeText: "Next Day Delivery (Amazon Prime)",
        availability: "Fast Delivery",
        locationInfo: "E-Commerce Dispatch to Indore Hub",
        direct_link: "https://www.amazon.in/s?k=A4+paper+bundle"
      },
      {
        vendorName: "Blinkit / Instamart",
        itemName: "JK Copier A4 Paper Bundle (75GSM, 100 Sheets Pack)",
        price: 160,
        timeMins: 20,
        timeText: "20 mins delivery (Blinkit Gate-Drop)",
        availability: "Fast Delivery",
        locationInfo: "Instant Gate-Side handoff. Ideal for emergency print prep.",
        direct_link: "https://blinkit.com/s/?q=A4+sheets"
      }
    ]
  },
  {
    item: {
      id: "stat-calculator",
      name: "Scientific Calculator",
      category: "Essentials",
      tags: ["scientific calculator", "calculator", "calc", "casio fx-991es", "casio fx", "engineering calc", "exam essential"]
    },
    options: [
      {
        vendorName: "College Stationery Shop",
        itemName: "Casio FX-991ES Plus 2nd Gen Scientific Calculator",
        price: 1250,
        timeMins: 2,
        timeText: "2 mins walk (Basement Shop)",
        availability: "In Stock",
        locationInfo: "B-Block Basement Stationery Shop (Includes 3-yr Warranty card)",
        openingHours: "9:00 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Shop",
        itemName: "Casio FX-991ES Non-warranty or Alternative",
        price: 1100,
        timeMins: 15,
        timeText: "15 mins walk (Manglia)",
        availability: "In Stock",
        locationInfo: "Dev electronics & Stationary, Manglia",
        openingHours: "9:00 AM - 8:00 PM"
      },
      {
        vendorName: "Amazon",
        itemName: "Casio FX-100MS 2nd Gen Scientific Calculator (Approved for exams)",
        price: 950,
        timeMins: 2880,
        timeText: "2 days (Amazon India)",
        availability: "In Stock",
        locationInfo: "Delivered directly with secure retail invoice",
        direct_link: "https://www.amazon.in/s?k=Scientific+Calculator+fx-991ES+Plus"
      }
    ]
  },
  {
    item: {
      id: "stat-chemistrymanual",
      name: "Engineering Chemistry Lab Manual",
      category: "Stationery",
      tags: ["chemistry lab manual", "chemistry manual", "lab manual", "1st year", "academic"]
    },
    options: [
      {
        vendorName: "College Stationery Shop",
        itemName: "Official AITR Engineering Chemistry Practical Notebook",
        price: 80,
        timeMins: 2,
        timeText: "2 mins walk (Basement Shop)",
        availability: "In Stock",
        locationInfo: "B-Block Basement Shop",
        openingHours: "9:00 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Shop",
        itemName: "Acropolis Syllabus Chemistry Manual Printout Book",
        price: 70,
        timeMins: 15,
        timeText: "15 mins walk (Manglia Square)",
        availability: "In Stock",
        locationInfo: "Local Xerox & Book Stall",
        openingHours: "9:00 AM - 8:30 PM"
      },
      {
        vendorName: "Amazon",
        itemName: "Universal Applied Chemistry Lab Record Book",
        price: 65,
        timeMins: 2880,
        timeText: "2 Days (Amazon)",
        availability: "1-2 Days",
        locationInfo: "Online delivery",
        direct_link: "https://www.amazon.in/s?k=engineering+chemistry+lab+manual"
      }
    ]
  },
  {
    item: {
      id: "stat-edset",
      name: "ED Graphic Instrument Set",
      category: "Essentials",
      tags: ["ed set", "drafter", "mini drafter", "drawing instrument", "engineering drawing set", "clips", "set square"]
    },
    options: [
      {
        vendorName: "College Stationery Shop",
        itemName: "Complete Mini Drafter with Roller Scale & Sheet Clips",
        price: 350,
        timeMins: 2,
        timeText: "2 mins walk (Basement Shop)",
        availability: "In Stock",
        locationInfo: "B-Block Basement College Shop",
        openingHours: "9:00 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Shop",
        itemName: "Omega Mini Drafter & Clips combo",
        price: 320,
        timeMins: 15,
        timeText: "15 mins walk (Manglia)",
        availability: "Limited Stock",
        locationInfo: "Mahadev Bookstore, Manglia",
        openingHours: "9:00 AM - 8:30 PM"
      },
      {
        vendorName: "Amazon",
        itemName: "Casio / Omega Mini Drafter for Engineering Drawing Class",
        price: 290,
        timeMins: 1440,
        timeText: "Next Day (Amazon Prime)",
        availability: "In Stock",
        locationInfo: "Shipped in protective transit carry bag",
        direct_link: "https://www.amazon.in/s?k=mini+drafter+engineering"
      }
    ]
  },
  {
    item: {
      id: "stat-penset",
      name: "Blue/Black Gel Pen Set",
      category: "Stationery",
      tags: ["pens", "gel pen", "blue pen", "black pen", "pilot pen", "pentel", "stationary"]
    },
    options: [
      {
        vendorName: "College Stationery Shop",
        itemName: "Hauser XO Ball/Gel Pen Combo (5 Blue + 5 Black)",
        price: 50,
        timeMins: 2,
        timeText: "2 mins walk (Basement Shop)",
        availability: "In Stock",
        locationInfo: "B-Block Basement College Shop",
        openingHours: "9:00 AM - 4:30 PM"
      },
      {
        vendorName: "Campus B Cafe",
        itemName: "Solo Pen Stall - Premium Pentel Energel pens",
        price: 40,
        timeMins: 2,
        timeText: "2 mins walk (Cafe counter)",
        availability: "In Stock",
        locationInfo: "B Cafe Billing Area",
        openingHours: "8:30 AM - 4:30 PM"
      },
      {
        vendorName: "Manglia Square Local Shop",
        itemName: "Rorito / Hauser Pen Pack (Cheapest deal)",
        price: 45,
        timeMins: 15,
        timeText: "15 mins walk (Manglia)",
        availability: "In Stock",
        locationInfo: "Manglia Square Local Bazaar Stationary",
        openingHours: "9:00 AM - 9:00 PM"
      },
      {
        vendorName: "Blinkit / Instamart",
        itemName: "Classmate Octane Gel Pen Set (Pack of 10 Neon Colors)",
        price: 100,
        timeMins: 15,
        timeText: "15 mins delivery (Blinkit)",
        availability: "Fast Delivery",
        locationInfo: "Rider drops at Main Gate 1. Instant help.",
        direct_link: "https://blinkit.com/s/?q=gel+pens"
      }
    ]
  }
];

export function findBestOption(
  query: string,
  maxBudget: number,
  maxTimeStr: string
): {
  searchedItem: string;
  options: VendorOption[];
  winner: VendorOption | null;
  alternative: VendorOption | null;
  actionPlan: string[];
} {
  const normQuery = query.toLowerCase().trim();
  
  // Parse Max Time Constraint in minutes
  let maxTimeMins = 10000;
  if (maxTimeStr.includes("5m") || maxTimeStr.toLowerCase().includes("immediate")) {
    maxTimeMins = 5;
  } else if (maxTimeStr.includes("30m") || maxTimeStr.toLowerCase().includes("under 30m")) {
    maxTimeMins = 30;
  } else if (maxTimeStr.toLowerCase().includes("end of day") || maxTimeStr.toLowerCase().includes("day")) {
    maxTimeMins = 480; // 8 hours
  } else if (maxTimeStr.toLowerCase().includes("any time") || maxTimeStr.trim() === "") {
    maxTimeMins = 10000; // Multi-day/Anytime
  }

  // Find a match based on item name or tags
  let foundRecord = CAMPUS_DATABASE.find(rec => {
    return rec.item.name.toLowerCase() === normQuery || 
           rec.item.tags.some(tag => tag.toLowerCase() === normQuery || normQuery.includes(tag.toLowerCase()));
  });

  // If no direct tag/name matched, try matching parts of query as fallback
  if (!foundRecord && normQuery.length > 2) {
    foundRecord = CAMPUS_DATABASE.find(rec => {
      return normQuery.includes(rec.item.name.toLowerCase()) ||
             rec.item.tags.some(tag => normQuery.includes(tag.toLowerCase()) || tag.toLowerCase().includes(normQuery));
    });
  }

  // If still not found, generate a dynamic response using Amazon & Local Shop fallbacks so the app never breaks!
  if (!foundRecord) {
    const fallbackItemName = query.charAt(0).toUpperCase() + query.slice(1);
    const fallbacks: VendorOption[] = [
      {
        vendorName: "College Stationery Shop",
        itemName: `${fallbackItemName} (Unverified availability)`,
        price: Math.max(25, Math.min(maxBudget - 5, 200)), // dynamic guess inside limits
        timeMins: 2,
        timeText: "2 mins walk (B-Block Basement)",
        availability: "In Stock",
        locationInfo: "Official B-Block Basement Shop, Acropolis Campus"
      },
      {
        vendorName: "Manglia Square Local Shop",
        itemName: `${fallbackItemName} (Inquire at checkout)`,
        price: Math.max(20, Math.min(maxBudget - 10, 180)),
        timeMins: 15,
        timeText: "15 mins walk (Manglia Square)",
        availability: "Available",
        locationInfo: "Manglia Chouraha Corner Shops, Indore"
      },
      {
        vendorName: "Amazon",
        itemName: `${fallbackItemName} (Authentic Online Options)`,
        price: Math.max(15, Math.min(maxBudget - 15, 150)),
        timeMins: 1440,
        timeText: "1-2 Days (Amazon Online)",
        availability: "Fast Delivery",
        locationInfo: "Direct dispatch to Manglia Indore",
        direct_link: `https://www.amazon.in/s?k=${encodeURIComponent(query)}`
      }
    ];
    
    foundRecord = {
      item: {
        id: "dynamic-fallback",
        name: fallbackItemName,
        category: "Essentials",
        tags: [normQuery]
      },
      options: fallbacks
    };
  }

  // Filter options based on Budget and Time constraints
  const availableOptions = foundRecord.options;
  
  // Filter for matching budget
  let withinBudget = availableOptions.filter(opt => opt.price <= maxBudget);
  if (withinBudget.length === 0) {
    // If absolutely none are under budget, relax budget constraint temporarily but sort by price
    withinBudget = [...availableOptions].sort((a, b) => a.price - b.price);
  }

  // Filter for matching time
  let withinTime = withinBudget.filter(opt => opt.timeMins <= maxTimeMins);
  if (withinTime.length === 0) {
    // If none match time limit, relax time constraint sort by time ASC
    withinTime = [...withinBudget].sort((a, b) => a.timeMins - b.timeMins);
  }

  // The "Winner" is the option in withinTime that delivers the best combination of SPEED and PRICE.
  // We prefer on-campus instant access if time limit is tight, otherwise online if price is substantially cheaper.
  let winner: VendorOption | null = null;
  if (withinTime.length > 0) {
    // By default, sort by suitability: On campus wins if they want immediate access.
    // Let's implement a clean scoring: lower is better score = price * index + time_penalty
    const scored = withinTime.map(opt => {
      // Score: Weight time and cost.
      // If immediate time requested, heavily penalize long delivery times.
      let timePenalty = opt.timeMins;
      if (maxTimeStr.includes("5m") && opt.timeMins > 5) {
        timePenalty += 5000; // massive penalty for not being immediate
      }
      if (maxTimeStr.includes("30m") && opt.timeMins > 30) {
        timePenalty += 2000;
      }
      const score = (opt.price * 1) + (timePenalty * 3);
      return { option: opt, score };
    });
    scored.sort((a, b) => a.score - b.score);
    winner = scored[0].option;
  }

  // The "Alternative" is the next runner up or an alternative online option if winner is physical (or vice versa)
  const remaining = withinTime.filter(opt => opt.vendorName !== winner?.vendorName);
  let alternative: VendorOption | null = remaining.length > 0 ? remaining[0] : null;
  if (!alternative && foundRecord.options.length > 1) {
    alternative = foundRecord.options.find(opt => opt.vendorName !== winner?.vendorName) || null;
  }

  // Formulate dynamic action plan based on selected winner!
  const actionPlan: string[] = [];
  if (winner) {
    const vName = winner.vendorName;
    if (vName.includes("Manasvi Foods")) {
      actionPlan.push(`🚶 Walk down to Block A ground floor. Manasvi Foods Canteen takes UPI (PhonePe/GPay).`);
      actionPlan.push(`⚡ Buy before peak Indore lunch hour (12:30 PM - 1:45 PM) to beat the AITR student crowd.`);
    } else if (vName.includes("Campus B")) {
      actionPlan.push(`🚶 Heading to B-Block ? Go straight to the central lobby cafe counter.`);
      actionPlan.push(`💳 Hot food is prepared on order. Best paired with local ginger tea.`);
    } else if (vName.includes("Stationery Shop")) {
      actionPlan.push(`📋 Keep your identity card handy, sometimes they log lab manuals.`);
      actionPlan.push(`🏃 Go to the Basement of Block B or near C-Block ground floor for standard prices.`);
    } else if (vName.includes("Manglia Square")) {
      actionPlan.push(`🛵 Grab a friend who has a bike or walk 1.2 KM (15m) towards Manglia Square, Indore.`);
      actionPlan.push(`💰 Local vendors offer deep regional discounts—ideal for heavy bundles!`);
    } else if (vName === "Amazon") {
      actionPlan.push(`🛒 Click the 'Order directly on Amazon' link below to secure the item.`);
      actionPlan.push(`📦 Set delivery location to: 'Acropolis Institute, Manglia Square, Bypass road, Indore - 453771' and mention your Hostel/Branch.`);
    } else if (vName.includes("Blinkit")) {
      actionPlan.push(`📱 Click the 'Order directly on Blinkit' link below and check out.`);
      actionPlan.push(`🏃 Walk down to Main Campus Gate 1 when you get the 'rider approaching' SMS (takes ~15 mins).`);
    }
  } else {
    actionPlan.push("🔍 Re-evaluate your search query or widen your budget and time restrictions for broader options.");
  }

  return {
    searchedItem: foundRecord.item.name,
    options: foundRecord.options,
    winner,
    alternative,
    actionPlan
  };
}
