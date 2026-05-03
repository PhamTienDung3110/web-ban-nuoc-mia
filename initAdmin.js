import connectMongo from './src/utils/db.js';
import Account from './src/models/Account.js';
import bcrypt from 'bcryptjs';

async function initAdmin() {
  try {
    await connectMongo();
    const adminExists = await Account.findOne({ role: 'ADMIN' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Account.create({
        username: 'admin',
        password: hashedPassword,
        name: 'Quản trị viên',
        role: 'ADMIN'
      });
      console.log('Default admin account created: admin / admin123');
    } else {
      console.log('Admin account already exists.');
    }
  } catch (err) {
    console.error('Error creating admin account:', err);
  }
  process.exit();
}

initAdmin();
