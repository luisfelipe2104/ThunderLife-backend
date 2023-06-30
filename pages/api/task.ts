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
        const { taskName, taskDescription, taskGoal, user_id } = req.body;

        if (!taskName || !taskGoal || !user_id) {
          return res.status(406).json({ msg: `data can't be empty!` });
        }

        await prisma.$connect();
        const data = { user_id, taskName, taskDescription, taskGoal };

        const result = await prisma.task.create({
          data: data,
        });

        return res.status(200).json({ msg: "task created!" });
        
// ------------------------------------------------------------------------
      case 'GET':
        const { userId } : any = req.query
        const HabitData: any = await prisma.task.findMany({
          where: { user_id: userId }
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
