// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log(req.method);

    switch (req.method) {
// ---------------------------------------------------------------------------
      case "POST":
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ msg: "Fill all the fields!" });
        }
        

        const user: any = await prisma.user.findFirst({
          where: {
            email: email 
          }
        })

        if (user) {
            const userPassword = user.password
            const isPasswordCorrect = bcrypt.compareSync(password, userPassword);
            
            if (isPasswordCorrect) {
                return res.status(200).json({ msg: "User logged in!", user: user })
            } else {
                return res.status(400).json({ msg: "Password is incorrect!" })
            }
        } else {
            return res.status(400).json({ msg: "User doesn't exists, please register first!" });
        }
        
// ------------------------------------------------------------------------
      case 'GET':
        // const { userId } : any = req.query
        const StreakData: any = await prisma.user.findMany({})
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
