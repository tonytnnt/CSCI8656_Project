
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, quantity } = req.body;
    const newItem = await prisma.shoppingListItem.create({
      data: { name, quantity: quantity || 1 },
    });
    res.status(201).json(newItem);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
