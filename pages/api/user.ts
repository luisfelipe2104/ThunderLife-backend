// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
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
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
          return res.status(400).json({ msg: "Fill all the fields!" });
        }
        
        if (password.length < 6) {
          return res.status(400).json({ msg: "Password must be at least 7 characteres!" })
        }

        if (password !== confirmPassword) {
          return res.status(400).json({ msg: "Passwords aren't the same!" })
        }

        const emailExists: any = await prisma.user.findFirst({
          where: {
            email: email 
          }
        })

        if (emailExists) {
          return res.status(400).json({ msg: "Email is already being used!" })
        }
        
        const salt = bcrypt.genSaltSync(3);
        const newPassword = bcrypt.hashSync(password, salt);
        const data = { name, email, password: newPassword }

        await prisma.user.create({ data: data })

        return res.status(201).json({ msg: "Account created!" });
        
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
