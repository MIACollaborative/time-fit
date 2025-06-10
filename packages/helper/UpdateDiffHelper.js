import { getPrismaClient } from "./prisma.js";

export default class UpdateDiffHelper {
  constructor() {}

  static async getUpdateDiffByCriteria(
    criteria
  ) {
    const prisma = getPrismaClient();
    const responseList = await prisma.update_diff.findMany(criteria);
    return responseList;
  }

}
