import DataRecordHelper from "../DataRecordHelper";
import { DateTime } from "luxon";

describe('data diff properly', () => {
  test('diff user info', async () => {
    const oldUserInfo = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 Main St, Anytown, USA",
      city: "Anytown",
      state: "CA",
    };

    const newUserInfo = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 Main St, Anytown, USA",
      city: "Anytown",
      state: "CA",
    };

    const compositeResult = await DataRecordHelper.getObjectAsJSONDiff(oldUserInfo, newUserInfo);

    const sampleDiff = {
        "added": [],
        "removed": [],
        "edited": []
    };

    expect(compositeResult).toEqual(sampleDiff);

    const oldUserInfo2 = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      address: "123 Main St, Anytown, USA",
      city: "Anytown",
      state: "CA",
    };

    const newUserInfo2 = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
    };

    const sampleDiff2 = {
        "added": [],
        "edited": [],
        "removed": [
            ["address", "123 Main St, Anytown, USA"],
            ["city", "Anytown"],
            ["state", "CA"]
        ],
    };

    const compositeResult2 = await DataRecordHelper.getObjectAsJSONDiff(oldUserInfo2, newUserInfo2);

    expect(compositeResult2).toEqual(sampleDiff2);
  });
});