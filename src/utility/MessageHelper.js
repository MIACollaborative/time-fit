import prisma from "./prisma.mjs";
import RandomizationHelper from "./RandomizationHelper";

export default class MessageHelper {
  constructor() {}

  static async findMessageByLabel(mLabel) {
    const message = await prisma.message.findFirst({
      where: { label: mLabel },
    });
    return message;
  }

  static async findMessageByGroup(gGroupName) {
    const messageList = await prisma.message.findMany({
      where: { group: gGroupName },
      orderBy: [
        {
          groupIndex: "asc",
        },
      ],
    });

    const randomIndex = Math.floor(
      messageList.length * RandomizationHelper.getRandomNumber()
    );
    const pickedMessage = messageList[randomIndex];
    return pickedMessage;
  }
}
