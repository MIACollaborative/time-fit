import TaskExecutor from "./TaskExecutor.js";

describe('checkpoint', () => {
  test('12:00 PM will match properly', () => {
    // static isCheckPointForUser(checkPoints, userInfo, now) 
    const mockCheckPoints = {
      enabled: true,
      pointList: [
        {
          type: "relative",
          reference: {
            type: "spec",
            value: {
              dateCriteria: {
                weekIndexList: [1, 2, 3, 4, 5],
              },
              timeStringType: "fixed",
              timeString: "12:00 PM",
            },
          },
          offset: {
            type: "plus",
            value: { hours: 0 },
          },
        },
      ],
    };
    const mockUserInfo = {
      username: "test",
      timezone: "America/New_York",
    };

    // create a Date that is at a Friday in 2025 March 14th
    const mockDate1 = new Date("2025-03-14T12:00:00.000-04:00");
    // this should be true
    expect(TaskExecutor.isCheckPointForUser(mockCheckPoints, mockUserInfo, mockDate1)[0]).toBe(true);

    // create a Date that is at a Saturday in 2025 March 15th
    const mockDate2 = new Date("2025-03-15T12:00:00.000-04:00");
    // this should be false
    expect(TaskExecutor.isCheckPointForUser(mockCheckPoints, mockUserInfo, mockDate2)[0]).toBe(false);

    // create a Date in 2025 that is at 12:01 pm on Friday in March
    const mockDate3 = new Date("2025-03-14T12:01:00.000-04:00");
    // this should be false
    expect(TaskExecutor.isCheckPointForUser(mockCheckPoints, mockUserInfo, mockDate3)[0]).toBe(false);
    

    // create another mock checkpoints with the same settings
    const mockCheckPoints2 = {
      enabled: true,
      pointList: [
        {
          type: "relative",
          reference: {
            type: "spec",
            value: {
              dateCriteria: {
                weekIndexList: [1, 2, 3, 4, 5],
              },
              timeStringType: "fixed",
              timeString: "12:00 PM",
            },
          },
          offset: {
            type: "plus",
            value: { hours: 1 },
          },
        },
      ],
    };

    // create a Date that is at 01:00 PM on a Friday in March 2025
    const mockDate4 = new Date("2025-03-14T13:00:00.000-04:00");
    // this should be true
    expect(TaskExecutor.isCheckPointForUser(mockCheckPoints2, mockUserInfo, mockDate4)[0]).toBe(true);
    
    // create a Date that is at 12:00 PM on a Friday in March 2025
    const mockDate5 = new Date("2025-03-14T12:00:00.000-04:00");
    // this should be false
    expect(TaskExecutor.isCheckPointForUser(mockCheckPoints2, mockUserInfo, mockDate5)[0]).toBe(false);

  });
});
