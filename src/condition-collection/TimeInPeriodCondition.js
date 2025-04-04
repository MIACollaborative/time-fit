import DateTimeHelper from "../helper/DateTimeHelper";

export default class TimeInPeriodCondition {
  constructor() {}
  static async execute(condition, params) {
    const { userInfo, datetime } = params;
    const dateTimeUTC = datetime.toUTC();
    const localTimeForUser = DateTimeHelper.getLocalTime(
      dateTimeUTC,
      userInfo.timezone
    );

    /*
    {

        type: timeInPeriod,
        
        criteria: {
            
            start:{
            
                reference: "activateAtDate",
                // Need to make sure that the minute and seconds do not get in the way of calculatioon
                offset: {type: "plus", value: {days: 7}}
                
            },
        
            end:{
            
                reference: "joinAt",
                
                offset: {type: "plus", value: {hours: 0}}
                
            }
        
        }
    
    }
    */

    const startDate = DateTimeHelper.generateStartOrEndDateTimeByReference(
      localTimeForUser,
      userInfo,
      condition.criteria.period.start,
      "start"
    );

    let endDate = DateTimeHelper.generateStartOrEndDateTimeByReference(
      localTimeForUser,
      userInfo,
      condition.criteria.period.end,
      "end"
    );

    // default to be inclusive
    if (
      condition.criteria.period.end.inclusive == undefined ||
      (condition.criteria.period.end.inclusive != undefined &&
        condition.criteria.period.end.inclusive == true)
    ) {
      // inclusive
      endDate = endDate.plus({ milliseconds: 1 });
    }

    const containDateTime = DateTimeHelper.isDateTimeInInterval(
      dateTimeUTC,
      startDate,
      endDate
    );

    recordInfo.dateTime = datetime;
    recordInfo.validInterval = validInterval;

    result = containDateTime;

    return {
      result,
      recordInfo,
    };
  }
}
