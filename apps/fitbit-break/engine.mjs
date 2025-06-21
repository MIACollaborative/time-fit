import TimeEngine from "@time-fit/time-engine/TimeEngine.js";
import CustomEmailAction from "@time-fit/action-collection/CustomEmailAction";
import HasFitbitStepCountOverThresholdForPersonDuringPeriodCondition from "@time-fit/data-source/fitbit/condition/HasFitbitStepCountOverThresholdForPersonDuringPeriodCondition";

// "It's 30 minutes already. Take a break from your screen!"

const newAction = new CustomEmailAction();

TimeEngine.registerAction("take-a-break-message", newAction);

// ideal
TimeEngine.registerCondition("hasFitbitStepCountOverThresholdForPersonDuringPeriod", HasFitbitStepCountOverThresholdForPersonDuringPeriodCondition);

const conditionLabelInfoList = [
  {
      label: "hasFitbitStepCountOverThresholdForPersonDuringPeriod",
      params:{
        opposite: false,
        criteria: {
            period: {
                start: {
                    reference: "now",
                    offset: { type: "minus", value: { minutes: 30 } }
                },
                end: {
                    reference: "now",
                    offset: { type: "plus", value: { hours: 0 } }
                }
            }
        }
      }
  }
];

const actionLabelInfoList = [
  {
    label: "take-a-break-message",
    params: {
      chance: 1.0,
      message: "It's 30 minutes already. Take a break from your screen!",
    },
  },
];
// register a new task that will be executed periodically
TimeEngine.registerOneCronUserConditionListActionListTask(
  "take-a-break",
  "*/30 * * * 1-5",
  conditionLabelInfoList,
  actionLabelInfoList
);

// Start the time engine
TimeEngine.start();
