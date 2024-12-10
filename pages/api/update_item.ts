
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id, name, quantity, completed } = req.body;
    const updatedItem = await prisma.shoppingListItem.update({
      where: { id },
      data: { name, quantity, completed },
    });
    res.status(200).json(updatedItem);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
