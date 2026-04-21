import * as admin from 'firebase-admin';

admin.initializeApp();

export { getRecommendation } from './recommendation';
export { scanFood } from './foodScan';
export { getGroceryList } from './grocery';
export { logAnalytics } from './analytics';

// Simple health score demo export below:
import { onCall, HttpsError } from 'firebase-functions/v2/https';

export const getHealthScore = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'User must log in');
  return {
    today: 85,
    trend: [80, 82, 85, 76, 88, 90, 85],
    streak: 4,
    message: "Great job maintaining your streak!"
  };
});
