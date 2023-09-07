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
        const { user_id, toDoName, scheduledHour, toDoDescription } = req.body;

        if (!user_id || !toDoName || !scheduledHour) {
          return res.status(406).json({ msg: `data can't be empty!` });
        }

        await prisma.$connect();
        const status = 'notDone'
        const doneHour = 'not done'
        const data = { user_id, toDoName, status, scheduledHour, doneHour, toDoDescription };


        const result = await prisma.toDo.create({
            data: data,
        });
           
        return res.status(200).json({ msg: "Task added!" });
        
// ------------------------------------------------------------------------
      case 'GET':
        const { userId } : any = req.query
        const ToDoData: any = await prisma.toDo.findMany({
          where: {
            user_id: userId,
          }
        })
        return res.status(200).json(ToDoData)

// ------------------------------------------------------------------------
      case 'PATCH':
        const { todo_id } : any = req.query
        const ToDo: any = await prisma.toDo.findFirst({
          where: {
            id: todo_id,
          }
        })

        const todo_status = ToDo.status

        if (todo_status === 'done') {
          await prisma.toDo.update({
            where: {
              id: todo_id
            },
            data: {
              status: 'notDone'
            }
          })
        }

        else if (todo_status === 'notDone') {
          await prisma.toDo.update({
            where: {
              id: todo_id
            },
            data: {
              status: 'done'
            }
          })
        }

        // else {
        //   await prisma.toDo.update({
        //     where: {
        //       id: todo_id
        //     },
        //     data: {
        //       status: 'notDone'
        //     }
        //   })
        // }

        return res.status(200).json({msg: "todo status updated!"})

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
