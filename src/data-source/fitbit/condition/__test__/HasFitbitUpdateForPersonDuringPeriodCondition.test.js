import HasFitbitUpdateForPersonDuringPeriodCondition from "../HasFitbitUpdateForPersonDuringPeriodCondition";
import FitbitUpdateHelper from "../../helper/FitbitUpdateHelper";
import { DateTime } from "luxon";

describe("fitbit udpate during period", () => {
  test("time between activate and complete", async () => {
    const mockCondition = {
      opposite: false,
      criteria: {
        period: {
          start: {
            reference: "activateAt",
            startOrEnd: "start",
            startEndUnit: "day",
          },
          end: {
            reference: "completeAt",
            startOrEnd: "end",
            startEndUnit: "day",
          },
        },
        inclusive: true,
      },
    };

    const mockUserInfo = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",    
      phone: "1234567890",
      fitbitId: "1234567890",
      activateAt: "2021-01-01T00:00:00Z",
      completeAt: "2021-01-30T00:00:00Z",
    };

    const mockDateTimeStart = DateTime.fromISO("2021-01-15T00:00:00Z");
    const mockDateTimeEnd = DateTime.fromISO("2021-01-30T00:00:00Z");
    // sample fitbit update
    /*
    id  String  @id @default(auto()) @map("_id") @db.ObjectId

  
    // for subscription notification from Fitbit
    collectionType String
    date String
    ownerId String
    ownerType String
    subscriptionId String  @unique
  
  
    // connect to users collection
    owner    users    @relation(fields: [ownerId], references: [fitbitId], onDelete: NoAction, onUpdate: NoAction)
  
    // connect to fibit_stream collection
    stream    fitbit_subscription    @relation(fields: [subscriptionId], references: [subscriptionId])
  
    // for query data: notification -> processed
    status String @default("notification")
  
    // for security logging
    ip String?
    validity Boolean?
    
  
    
  
    // for time
    createdAt DateTime? @default(now())
    updatedAt DateTime? @updatedAt
    */

    const mockGetUserFitbitUpdateDuringPeriodByIdAndOwnerType = jest.fn();
    mockGetUserFitbitUpdateDuringPeriodByIdAndOwnerType.mockResolvedValue([
        {
            id: 1,
            ownerId: "1234567890",
            ownerType: "user",
            collectionType: "activities",
            date: "2021-01-01",
            subscriptionId: "1234567890",
            status: "notification",
            createdAt: "2021-01-01T00:00:00Z",
        },
        {
            id: 2,
            ownerId: "1234567890",
            ownerType: "user",
            collectionType: "activities",
            date: "2021-01-02",
            subscriptionId: "1234567890",
            status: "notification",
            createdAt: "2021-01-02T00:00:00Z",
        }
    ]);

    const mockGetUserFitbitUpdateDuringPeriodByIdAndOwnerTypeSpy = jest.spyOn(FitbitUpdateHelper.prototype, "getUserFitbitUpdateDuringPeriodByIdAndOwnerType").mockImplementation(mockGetUserFitbitUpdateDuringPeriodByIdAndOwnerType);


    const compositeResult =
      await HasFitbitUpdateForPersonDuringPeriodCondition.execute(condition, {
        userInfo: mockUserInfo,
        datetime: mockDateTime,
      });

      expect(compositeResult).toEqual({
        result: true,
        recordInfo: {
          fitbitUpdateCount: 2,
          fitbitUpdateTimeList: ["2021-01-01T00:00:00Z", "2021-01-02T00:00:00Z"],
        },
      });

      mockGetUserFitbitUpdateDuringPeriodByIdAndOwnerTypeSpy.mockRestore();
  });
});
