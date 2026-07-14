require('dotenv').config();
const mongoose = require('mongoose');
const Rooster = require('./models/Rooster');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ghilbert_transport';

const sampleRoosters = [
  {
    name: 'Tanaw',
    breed: 'Bisaya Native',
    ageMonths: 8,
    price: 1500,
    cost: 900,
    description: 'A hardy native rooster common in Philippine backyards.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzvQqzqjv4rYtJ5bRkYpQm7YpY2o6xk9sF8w&s',
    stock: 5,
    available: true,
  },
  {
    name: 'Dagit',
    breed: 'Shamo',
    ageMonths: 10,
    price: 4500,
    cost: 2800,
    description: 'Tall, muscular Shamo rooster with upright stance.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXg54IgCOTkIxgAjlI-rGFESD0d8KDLN7k7HbIDYMPonE1cn8kmC9SiNiY&s=10',
    stock: 2,
    available: true,
  },
  {
    name: 'Bagani',
    breed: 'Sweater',
    ageMonths: 7,
    price: 3200,
    cost: 2000,
    description: 'Sweater gamefowl known for speed and agility.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5kX6Z7Q2s6c8kZ7l3R1hX7YcR6Zs0w7j1Fw&s',
    stock: 3,
    available: true,
  },
  {
    name: 'Alimpuyo',
    breed: 'Kelso',
    ageMonths: 9,
    price: 3800,
    cost: 2300,
    description: 'Kelso rooster with intelligence and cutting ability.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0pVw8ZQ6zq7Yw7o3YwWz6q3p5k8v6Y6jQ3g&s',
    stock: 4,
    available: true,
  },
  {
    name: 'Kidlat',
    breed: 'Hatch',
    ageMonths: 8,
    price: 3500,
    cost: 2100,
    description: 'Powerful Hatch rooster with strong legs and endurance.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2rFzZ7w7k6Y9Qp3Y5o7Zs9n6x7Yp8k3l2pA&s',
    stock: 3,
    available: true,
  },
  {
    name: 'Lakan',
    breed: 'Roundhead',
    ageMonths: 9,
    price: 4200,
    cost: 2600,
    description: 'Roundhead rooster known for smart fighting style.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6yYw8Y7x5pZ6k7w8Y5p3x9Y6p7Yw8Z6q1xQ&s',
    stock: 2,
    available: true,
  },
  {
    name: 'Tala',
    breed: 'Banaba',
    ageMonths: 6,
    price: 2500,
    cost: 1500,
    description: 'Banaba native breed with good adaptability.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5zY7k8w6Y3p6Z9k7Y5p3x8Y6p7Yw8Z6q1xA&s',
    stock: 6,
    available: true,
  },
  {
    name: 'Siklab',
    breed: 'Grey',
    ageMonths: 8,
    price: 3600,
    cost: 2200,
    description: 'Grey gamefowl known for speed and cutting accuracy.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6zY8k9w7Y3p6Z9k7Y5p3x8Y6p7Yw8Z6q1xB&s',
    stock: 3,
    available: true,
  },
  {
    name: 'Bantay',
    breed: 'Cornish',
    ageMonths: 7,
    price: 2800,
    cost: 1700,
    description: 'Compact Cornish rooster used for meat production.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7zY9k8w7Y3p6Z9k7Y5p3x8Y6p7Yw8Z6q1xC&s',
    stock: 4,
    available: true,
  },
  {
    name: 'Datu',
    breed: 'Leghorn',
    ageMonths: 6,
    price: 2000,
    cost: 1200,
    description: 'Active Leghorn rooster known for high fertility.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9zY8k7w6Y3p6Z9k7Y5p3x8Y6p7Yw8Z6q1xD&s',
    stock: 5,
    available: true,
  },
  {
    name: 'Haribon',
    breed: 'Rhode Island Red',
    ageMonths: 8,
    price: 2600,
    cost: 1600,
    description: 'Dual-purpose breed for eggs and meat.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8zY7k6w5Y3p6Z9k7Y5p3x8Y6p7Yw8Z6q1xE&s',
    stock: 4,
    available: true,
  },
  {
    name: 'Agila',
    breed: 'Plymouth Rock',
    ageMonths: 7,
    price: 2400,
    cost: 1500,
    description: 'Docile Plymouth Rock rooster with fast growth.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcP7zY6k5w4Y3p6Z9k7Y5p3x8Y6p7Yw8Z6q1xF&s',
    stock: 3,
    available: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected. Clearing existing roosters...');
  await Rooster.deleteMany({});
  await Rooster.insertMany(sampleRoosters);
  console.log(`Seeded ${sampleRoosters.length} roosters.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
