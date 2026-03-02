const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const Admin = require('./models/Admin');

const EMAIL = 'admin@gmail.com';
const PASSWORD = 'admin123';
const USERNAME = 'superadmin';

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('Missing MONGO_URI in environment (.env)');
  }

  await mongoose.connect(mongoUri);

  const existing = await Admin.findOne({ email: EMAIL });
  if (existing) {
    console.log('ℹ️ Admin already exists:', EMAIL);
    return;
  }

  await Admin.create({
    username: USERNAME,
    email: EMAIL,
    password: PASSWORD
  });

  console.log('✅ Admin created successfully');
  console.log(`Login using:\nEmail: ${EMAIL}\nPassword: ${PASSWORD}`);
}

main()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Failed to create admin:', err.message);
    try {
      await mongoose.disconnect();
    } catch (_) {
      // ignore
    }
    process.exit(1);
  });
