import TimeInPeriodCondition from "../TimeInPeriodCondition";
import { DateTime } from "luxon";

describe('time in period', () => {
  test('time in period', async () => {
    const mockUserInfo = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 Main St, Anytown, USA",
      city: "Anytown",
      state: "CA",
    };

    const condition = {
      criteria: {
        start: {
          reference: "activateAtDate",
          offset: { type: "plus", value: { days: 7 } },
        },
        end: {
          reference: "joinAt",
          offset: { type: "plus", value: { hours: 0 } },
        },
      },

    const compositeResult = await PersonCondition.execute(condition, {
      userInfo: mockUserInfo,
      datetime: DateTime.now(),
    });

    expect(compositeResult.result).toBe(true);


  });
});