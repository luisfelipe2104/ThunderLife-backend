// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    try {
        await prisma.$connect();
        const channel = { name: 'Adnan Halilovic 5', email: 'luis@gmail.com', password: 'sla' };
    
        const result = await prisma.user.create({
          data: channel,
        });
        res.status(200).json(result)
        console.log(res);
      } catch (err: any) {
        console.log(err);
        res.status(400).json(err)
      } finally {
        async () => {
          await prisma.$disconnect();
        };
      }
}
