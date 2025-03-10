import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connection URI
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fayredgeDashboard';
const client = new MongoClient(uri);
const dbName = 'fayredgeDashboard';

// Sample data generator
function generateSampleData() {
  const cities = ['Singapore Central', 'Woodlands', 'Tampines', 'Jurong', 'Punggol', 'Pasir Ris'];
  const districts = ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'];
  const propertyTypes = ['Condominium', 'Apartment', 'Landed House', 'Bungalow', 'Penthouse'];
  const features = [
    'Swimming Pool', 'Gym', 'Tennis Court', 'Playground', 'BBQ Pit', 
    'Security', '24/7 Concierge', 'Rooftop Garden', 'Jacuzzi', 'Smart Home'
  ];
  const statuses = ['Available', 'Sold', 'Reserved'];
  const feedbackTexts = [
    'Very satisfied with the property and service!',
    'The agent was very helpful but pricing was higher than expected.',
    'Great location but the property needed some renovations.',
    'Excellent service from start to finish!',
    'The process took longer than expected.',
    'Everything went smoothly, highly recommend!',
    'Property was as advertised, no surprises.',
    'Agent was knowledgeable but sometimes slow to respond.',
    'Perfect fit for my needs, satisfied with purchase.',
    'Good experience overall, would use service again.'
  ];
  const salesAgents = [
    'John Tan', 'Sarah Wong', 'Michael Lee', 'Rachel Lim', 
    'David Chen', 'Jennifer Koh', 'Brian Ng', 'Amanda Teo'
  ];

  // Generate property listings
  const properties = [];
  for (let i = 1; i <= 50; i++) {
    const propertyId = `PROP${String(i).padStart(3, '0')}`;
    const cityIndex = Math.floor(Math.random() * cities.length);
    const city = cities[cityIndex];
    const district = districts[Math.floor(Math.random() * districts.length)];
    
    const property = {
      propertyId,
      propertyName: `${city} ${propertyTypes[Math.floor(Math.random() * propertyTypes.length)]} ${i}`,
      propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      location: {
        city,
        district,
        address: `${Math.floor(Math.random() * 100) + 1} ${district} Road, ${city}`
      },
      price: Math.floor(Math.random() * 5000000) + 500000,
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 4) + 1,
      area: Math.floor(Math.random() * 2000) + 500,
      features: Array.from(
        { length: Math.floor(Math.random() * 5) + 1 },
        () => features[Math.floor(Math.random() * features.length)]
      ).filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
      status: statuses[Math.floor(Math.random() * statuses.length)],
      listedDate: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000)
    };
    
    properties.push(property);
  }

  // Generate sales data
  const sales = [];
  for (let i = 1; i <= 200; i++) {
    const propertyIndex = Math.floor(Math.random() * properties.length);
    const property = properties[propertyIndex];
    
    // If property is sold, change its status
    if (Math.random() > 0.5) {
      property.status = 'Sold';
    }
    
    const sale = {
      propertyId: property.propertyId,
      propertyName: property.propertyName,
      location: {
        city: property.location.city,
        district: property.location.district
      },
      price: property.price,
      dateOfSale: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      customer: {
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        ageGroup: ['18-25', '26-35', '36-45', '46-55', '56+'][Math.floor(Math.random() * 5)]
      },
      salesAgent: salesAgents[Math.floor(Math.random() * salesAgents.length)],
      nps: Math.floor(Math.random() * 11), // 0-10
      feedback: feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)]
    };
    
    sales.push(sale);
  }

  return { properties, sales };
}

// Save data to JSON files
function saveDataToFiles(data) {
  const dataDir = path.join(__dirname, '..', 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(dataDir, 'properties.json'), 
    JSON.stringify(data.properties, null, 2)
  );
  
  fs.writeFileSync(
    path.join(dataDir, 'sales.json'), 
    JSON.stringify(data.sales, null, 2)
  );
  
  console.log('Sample data saved to files in the data directory');
}

// Insert data into MongoDB
async function populateDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB server');
    
    const db = client.db(dbName);
    
    // Generate sample data
    const data = generateSampleData();
    
    // Save to files first (optional)
    saveDataToFiles(data);
    
    // Clear existing collections
    await db.collection('properties').deleteMany({});
    await db.collection('sales').deleteMany({});
    
    // Insert new data
    if (data.properties.length > 0) {
      const propertiesResult = await db.collection('properties').insertMany(data.properties);
      console.log(`${propertiesResult.insertedCount} properties inserted`);
    }
    
    if (data.sales.length > 0) {
      const salesResult = await db.collection('sales').insertMany(data.sales);
      console.log(`${salesResult.insertedCount} sales records inserted`);
    }
    
    console.log('Database populated successfully');
    
  } catch (err) {
    console.error('Error populating database:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
populateDatabase().catch(console.error);