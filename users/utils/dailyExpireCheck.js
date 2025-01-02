import cron from 'node-cron';
import TenantUser from '../model/tenent.model.js';

// Schedule a cron job to run daily at midnight IST
cron.schedule('* * * * *', async () => {
  console.log('Running daily expiry check...');
  
  const todayIST = getIndianDateAsString(); // Get today's date as a string in ISO format
 console.log(todayIST)
  try {
    // Update all expired plans in one operation
    const result = await TenantUser.updateMany(
      {
        softwarePlan: true,
        expiryDate: { $lt: todayIST }, // String comparison works for ISO 8601 format
      },
      { $set: { softwarePlan: false } }
    );
    console.log(`Updated ${result.modifiedCount} expired plans.`);
  } catch (err) {
    console.error('Error during expiry check:', err.message);
  }
});

// Helper function to get the current IST date as a string
function getIndianDateAsString() {
  const now = new Date();
  const utcOffsetInMilliseconds = now.getTime() + now.getTimezoneOffset() * 60 * 1000; // Convert to UTC
  const ISTOffsetInMilliseconds = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(utcOffsetInMilliseconds + ISTOffsetInMilliseconds)
    .toISOString(); // Convert to ISO 8601 string
}

export default {};
