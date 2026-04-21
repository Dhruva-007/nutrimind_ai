import { onCall, HttpsError } from 'firebase-functions/v2/https';
// import { BigQuery } from '@google-cloud/bigquery';
import * as crypto from 'crypto';

export const logAnalytics = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'User must log in');
  
  const { event, metadata } = request.data;
  
  // Anonymize user ID
  const hash = crypto.createHash('sha256').update(request.auth.uid).digest('hex');

  // Insert row into BigQuery dataset 'nutrimind' table 'events' (Mock)
  // const bigquery = new BigQuery();
  // await bigquery.dataset('nutrimind').table('events').insert([{ event, userId: hash, metadata, timestamp: new Date() }]);
  
  console.log(`BQU Insert Emulation -> EVENT: ${event.event_type} HASH: ${hash}`);

  return { logged: true };
});
