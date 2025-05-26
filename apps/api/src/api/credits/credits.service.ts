import { logger } from "@/server";
import { prismaClient } from "@repo/db";

export class CreditService {
  async removeCredits(userId: string, amount: number = 1): Promise<number> {
    const result = await prismaClient.user.update({
      where: {
        id: userId,
        credits: { gte: amount },
      },
      data: {
        credits: { decrement: amount },
      },
    });
    if (!result) {
      throw new Error("Insufficient credits or user not found");
    }
    return result.credits;
  }

  async addCredits(userId: string, amount: number): Promise<number> {
    const result = await prismaClient.user.update({
      where: { id: userId },
      data: {
        credits: { increment: amount },
      },
    });
    if (!result) {
      throw new Error("User not found");
    }
    return result.credits;
  }

  static async getCredits(userId: string): Promise<number> {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user?.credits || 0;
  }

  async performDailyReset(): Promise<number> {
    try {
      const updateResult = await prismaClient.user.updateMany({
        where: { credits: { lt: 10 } },
        data: { credits: 10 },
      });

      logger.info(
        `Daily reset performed. Users with less than 10 credits have been set to 10. Updated ${updateResult.count} users.`,
      );
      return updateResult.count;
    } catch (error) {
      logger.error("Error during daily reset:", error);
      return 0;
    }
  }
}
export const creditService = new CreditService();
