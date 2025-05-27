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
}
