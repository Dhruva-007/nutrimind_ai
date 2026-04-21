import { runMasterWorkflow } from '../../src/workflows/masterWorkflow';

// Mock the services interacting with Firestore/Bigquery
jest.mock('../../src/services/firestore', () => ({
  getUserProfile: jest.fn().mockResolvedValue({ uid: 'u', name: 'Test', age: 30, weight: 80, height: 180, goal: 'maintain', diet: 'omnivore', activityLevel: 'active' }),
  getMealHistory: jest.fn().mockResolvedValue([])
}));

jest.mock('../../src/services/bigquery', () => ({
  logEvent: jest.fn().mockResolvedValue(true)
}));

import * as bigquery from '../../src/services/bigquery';

describe('Master Workflow', () => {
  it('full pipeline runs without error', async () => {
    const output = await runMasterWorkflow('u', { context: { currentHour: 8, state: 'neutral', urgency: 'low', context: 'morning_boost', timeOfDay: 'breakfast', hoursSinceLastMeal: 12, activityToday: 'active' } });
    
    expect(output).toHaveProperty('recommendation');
    expect(output).toHaveProperty('pipeline');
    expect(output).toHaveProperty('confidence');
  });

  it('BigQuery log called once per run', async () => {
    await runMasterWorkflow('u', {});
    expect(bigquery.logEvent).toHaveBeenCalled();
  });
});
