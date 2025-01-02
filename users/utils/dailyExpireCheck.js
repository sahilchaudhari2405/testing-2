import cron from 'node-cron';
import TenantUser from '../model/tenent.model.js';

cron.schedule('0 0 * * *', async () => { // Runs daily at midnight IST
  console.log('Running daily expiry check...');
  const todayIST = getIndianDate().toISOString().split('T')[0];

  try {
    // Update all expired plans in one operation
    const result = await TenantUser.updateMany(
      { softwarePlan: true, expiryDate: { $lt: todayIST } },
      { $set: { softwarePlan: false } }
    );

    console.log(`Updated ${result.modifiedCount} expired plans.`);
  } catch (err) {
    console.error('Error during expiry check:', err.message);
  }
});

function getIndianDate() {
  const now = new Date();
  const utcOffsetInMilliseconds = now.getTime() + now.getTimezoneOffset() * 60 * 1000; // Convert to UTC
  const ISTOffsetInMilliseconds = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(utcOffsetInMilliseconds + ISTOffsetInMilliseconds);
}
export default {};