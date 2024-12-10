
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await prisma.shoppingListItem.findMany();
    res.status(200).json(items);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
