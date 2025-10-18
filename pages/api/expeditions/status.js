// pages/api/expeditions/status.js
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }
  const { wallet } = req.query;
  if (!wallet) {
    return res.status(400).json({ message: 'A carteira do usuário é obrigatória.' });
  }
  try {
    const expeditions = await prisma.expedition.findMany({
      where: { userWallet: wallet },
      orderBy: { startedAt: 'desc' },
    });
    res.status(200).json(expeditions);
  } catch (error) {
    console.error('Erro ao buscar status das expedições:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
