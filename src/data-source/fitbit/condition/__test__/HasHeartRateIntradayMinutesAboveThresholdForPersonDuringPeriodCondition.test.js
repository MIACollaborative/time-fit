import HasHeartRateIntradayMinutesAboveThresholdForPersonDuringPeriodCondition from "../HasHeartRateIntradayMinutesAboveThresholdForPersonDuringPeriodCondition";
import FitbitDataHelper from "../../helper/FitbitDataHelper";
import { DateTime } from "luxon";
import { jest } from '@jest/globals';

describe("fitbit heart rate intraday minutes above threshold during period", () => {
  test("time between the first 7 days", async () => {
    const mockCondition = {
      opposite: false,
      criteria: {
        wearingLowerBoundMinutes: 60 * 8,
        wearingDayLowerBoundCount: 2,
        wearingDayResultAggregator: "and", // only matter if wearingDayLowerBoundCount is undefined
        period: {
          start: {
            reference: "activateAt",
            startOrEnd: "start",
            startEndUnit: "day",
          },
          end: {
            reference: "activateAt",
            startOrEnd: "end",
            startEndUnit: "day",
            offset: {
              type: "plus",
              value: {
                days: 6,
              },
            },
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

    // sample data format
    /*
    model fitbit_data {

        id  String  @id @default(auto()) @map("_id") @db.ObjectId
      
        // for easy categorization
        dataType String
        ownerId String
        dateTime String
        compositeId String @unique // as a unique identifier for query
        lastModified String
        content Json
      
        // connect to users collection
        owner    users    @relation(fields: [ownerId], references: [fitbitId], onDelete: NoAction, onUpdate: NoAction)
      
        // for standard time
        createdAt DateTime? @default(now())
        updatedAt DateTime? @updatedAt
      }
    */

    const mockMinList = [400, 600, 400, 600, 600, 400, 600];

    const mockGetUserFitbitWearingMinutesPerDayListDuringPeriod = jest.fn();
    // a list of 7  elements, each with a value between 0 and 1440
    mockGetUserFitbitWearingMinutesPerDayListDuringPeriod.mockResolvedValue(mockMinList);

    const mockGetUserFitbitWearingMinutesPerDayListDuringPeriodSpy = jest.spyOn(FitbitDataHelper, "getUserFitbitWearingMinutesPerDayListDuringPeriod").mockImplementation(mockGetUserFitbitWearingMinutesPerDayListDuringPeriod);


    const compositeResult =
      await HasHeartRateIntradayMinutesAboveThresholdForPersonDuringPeriodCondition.execute(mockCondition, {
        userInfo: mockUserInfo,
        datetime: mockDateTimeStart,
      });

    console.log(compositeResult);

      expect(compositeResult).toEqual({
        result: true,
        recordInfo: {
            minsList: mockMinList,
            resultList: [false, true, false, true, true, false, true],
        },
      });

      mockGetUserFitbitWearingMinutesPerDayListDuringPeriodSpy.mockRestore();
  });
});
