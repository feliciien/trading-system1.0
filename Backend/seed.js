// seed.js
// This script seeds the database with initial data, including a test user.

const db = require('./models'); // Adjust the path according to your project structure

async function seed() {
  try {
    // Create a test user
    await db.User.create({
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      // Include any other required fields based on your User model
    });

    console.log('Database seeded successfully.');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
