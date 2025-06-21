export default class TaskGeneratorHelper {
  constructor() {}

  static generateCronActionTask(
    taskLabel,
    cronExpression,
    actionType,
    participantIndependent = true,
    ignoreTimezone = true
  ) {
    return {
      label: taskLabel,
      enabled: true,
      priority: 100,
      participantIndependent: participantIndependent,
      preActivationLogging: false,
      ignoreTimezone: ignoreTimezone,
      checkPoints: {
        enabled: true,
        pointList: [
          {
            type: "relative",
            reference: {
              type: "cron",
              value: cronExpression,
            },
            offset: {
              type: "plus",
              value: { hours: 0 },
            },
          },
        ],
      },
      group: {
        type: "all",
      },
      outcomes: {
        randomizationEnabled: false,
        outcomeList: [
          {
            chance: 1.0,
            action: {
              type: actionType,
            },
          },
        ],
      },
      preCondition: { enabled: false },
    };
  }

  static registerOneCronUserConditionListActionListTask(
    taskLabel,
    cronExpression,
    conditionLabelInfoList,
    conditionListOperator="and",
    actionLabelInfoList,
    participantIndependent = true,
    ignoreTimezone = true
  ) {
    return {
      label: taskLabel,
      enabled: true,
      priority: 100,
      participantIndependent: participantIndependent,
      preActivationLogging: false,
      ignoreTimezone: ignoreTimezone,
      checkPoints: {
        enabled: true,
        pointList: [
          {
            type: "relative",
            reference: {
              type: "cron",
              value: cronExpression,
            },
            offset: {
              type: "plus",
              value: { hours: 0 },
            },
          },
        ],
      },
      group: {
        type: "all",
      },
      outcomes: {
        randomizationEnabled: actionLabelInfoList.length > 1,
        outcomeList: actionLabelInfoList.map((actionLabelInfo) => {
          return {
            chance: actionLabelInfo.info.chance,
            action: {
              type: actionLabelInfo.label
              // now, how to store the rest of the information?
            },
          };
        })
      },
      preCondition: { 
        enabled: conditionLabelInfoList.length > 0,
        conditionRelationship: conditionListOperator? conditionListOperator : "and",
        conditionList: conditionLabelInfoList.map((conditionLabelInfo) => {
          return {
            type: conditionLabelInfo.label,
            // now, how to store the rest of the information?
          };
        })
      },
    };
  }
}
