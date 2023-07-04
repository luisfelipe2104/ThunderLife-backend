// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { log } from "console";
const prisma = new PrismaClient();
type Data = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log(req.method);

    switch (req.method) {
// ---------------------------------------------------------------------------
      case "POST":
        const { habitName, habitDescription, habitGoal, user_id } = req.body;

        if (!habitName || !habitGoal || !user_id) {
          return res.status(406).json({ msg: `data can't be empty!` });
        }

        await prisma.$connect();
        const data = { user_id, habitName, habitDescription, habitGoal };

        const result = await prisma.habit.create({
          data: data,
        });

        return res.status(200).json({ msg: "habit added!" });
        
// ------------------------------------------------------------------------
      case 'GET':
        const { userId } : any = req.query
        const HabitData: any = await prisma.habit.findMany({
          where: { user_id: userId }
        })

        const StreakData: any = await prisma.streak.findMany({
          where: { user_id: userId}
        })

        await HabitData.map(async (habit: any) => {
          const streakArray: any = []
          await StreakData.map((streak: any) => {
            if (habit.id == streak.habit_id) {
              streakArray.push(streak)
              habit.streak = streakArray
            }
          })
        })
        return res.status(200).json(HabitData)

// ------------------------------------------------------------------------
    }
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ msg: err.message });
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
}
