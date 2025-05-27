export default class TaskGeneratorHelper {
  constructor() {}

  static async generateCronActionTask(taskLabel, cronExpression, actionType, participantIndependent=true, ignoreTimezone=true) {
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
              type: "absolute",
              reference: {
                type: "cron",
                value: cronExpression
              }
            }
          ]
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
