// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
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
        const { habit_id, user_id, date, comment, status } = req.body;

        if (!habit_id || !date || !user_id || !status) {
          return res.status(406).json({ msg: `data can't be empty!` });
        }

        await prisma.$connect();
        const data = { habit_id, date, user_id, comment, status };

        const streakExists: any = await prisma.streak.findFirst({
            where: {
                habit_id: habit_id,
                user_id: user_id,
                date: date
            }
        })

        if (!streakExists) {
            const result = await prisma.streak.create({
              data: data,
            });
        } else {
            const result = await prisma.streak.update({
                where: {
                    id: streakExists.id
                },
                data: data,
            });
        }

        return res.status(200).json({ msg: "keep tracking!" });
        
// ------------------------------------------------------------------------
      case 'GET':
        // const { userId } : any = req.query
        const StreakData: any = await prisma.streak.findMany({})
        return res.status(200).json(StreakData)

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
