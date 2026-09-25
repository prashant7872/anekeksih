import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getCooperativeFinance(req: AuthenticatedRequest, res: Response) {
  try {
    const coop = await prisma.cooperative.findFirst({
      include: {
        fund: true,
        _count: { select: { members: true, proposals: true } },
      },
    });

    if (!coop) {
      return res.status(404).json({ error: 'No cooperative configured' });
    }

    // Default simulated initial pool if 0
    const fund = coop.fund || {
      totalPlatformGross: 145000,
      totalCommission: 14500,
      welfarePool: 4350,
      insurancePool: 4350,
      reinvestmentPool: 2900,
      dividendPool: 2900,
    };

    // Calculate aggregated worker earnings across platform
    const workerEarningsSum = await prisma.workerEarning.aggregate({
      _sum: { netEarnings: true, grossAmount: true, welfareContribution: true },
    });

    return res.json({
      cooperative: {
        id: coop.id,
        name: coop.name,
        registrationCode: coop.registrationCode,
        region: coop.region,
        commissionPct: coop.commissionPct,
        memberCount: coop._count.members,
      },
      fund: {
        totalGross: fund.totalPlatformGross,
        totalCommission: fund.totalCommission,
        workerEarningsTotal: workerEarningsSum._sum.netEarnings || fund.totalPlatformGross - fund.totalCommission,
        welfarePool: fund.welfarePool,
        insurancePool: fund.insurancePool,
        reinvestmentPool: fund.reinvestmentPool,
        dividendPool: fund.dividendPool,
      },
      allocationPercentages: {
        welfare: coop.welfareSharePct,
        insurance: coop.insuranceSharePct,
        reinvestment: coop.reinvestSharePct,
        dividend: coop.dividendSharePct,
      },
      isDemo: true,
      demoNote: 'Demo figures for Smart India Hackathon 2026 Evaluation',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch cooperative finance', details: error.message });
  }
}

export async function getVoteProposals(req: AuthenticatedRequest, res: Response) {
  try {
    const proposals = await prisma.voteProposal.findMany({
      include: {
        options: true,
        votes: req.user ? { where: { voterId: req.user.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = proposals.map((p) => {
      const userVote = req.user && p.votes && p.votes.length > 0 ? p.votes[0] : null;
      return {
        ...p,
        hasVoted: Boolean(userVote),
        userVotedOptionId: userVote?.optionId || null,
        votes: undefined, // remove array from response for cleaner payload
      };
    });

    return res.json({ proposals: enriched });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch proposals', details: error.message });
  }
}

export async function castVote(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { id } = req.params; // proposalId
  const { optionId } = req.body;

  if (!optionId) {
    return res.status(400).json({ error: 'optionId is required' });
  }

  try {
    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        proposalId_voterId: {
          proposalId: id,
          voterId: req.user.id,
        },
      },
    });

    if (existingVote) {
      return res.status(400).json({ error: 'You have already cast your vote for this decision. One member, one vote.' });
    }

    // Record vote
    await prisma.vote.create({
      data: {
        proposalId: id,
        optionId,
        voterId: req.user.id,
      },
    });

    // Increment option count
    await prisma.voteOption.update({
      where: { id: optionId },
      data: { voteCount: { increment: 1 } },
    });

    // Update proposal total votes and recount percentages
    await prisma.voteProposal.update({
      where: { id },
      data: { votesCastCount: { increment: 1 } },
    });

    // Recalculate percentages for all options
    const allOptions = await prisma.voteOption.findMany({ where: { proposalId: id } });
    const totalVotes = allOptions.reduce((sum, o) => sum + o.voteCount, 0);

    for (const opt of allOptions) {
      const pct = totalVotes > 0 ? Math.round((opt.voteCount / totalVotes) * 100) : 0;
      await prisma.voteOption.update({
        where: { id: opt.id },
        data: { percentage: pct },
      });
    }

    const updatedProposal = await prisma.voteProposal.findUnique({
      where: { id },
      include: { options: true },
    });

    return res.json({
      success: true,
      proposal: updatedProposal,
      message: 'Vote cast successfully. Your co-owner voice has been recorded.',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to cast vote', details: error.message });
  }
}

export async function getIdeas(req: Request, res: Response) {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        author: { select: { name: true, role: true } },
      },
      orderBy: { supportCount: 'desc' },
    });
    return res.json({ ideas });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch ideas', details: error.message });
  }
}

export async function createIdea(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { title, category = 'Pricing & Commission', description, type = 'IDEA' } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const coop = await prisma.cooperative.findFirst();
    if (!coop) {
      return res.status(404).json({ error: 'No cooperative configured' });
    }

    const idea = await prisma.idea.create({
      data: {
        cooperativeId: coop.id,
        authorId: req.user.id,
        title,
        category,
        description,
        type,
        supportCount: 1,
        status: 'OPEN',
      },
      include: { author: { select: { name: true } } },
    });

    return res.status(201).json({
      success: true,
      idea,
      message: 'Submitted to collective. Visible to all fellow member-owners.',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to submit idea', details: error.message });
  }
}

export async function supportIdea(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  try {
    const updated = await prisma.idea.update({
      where: { id },
      data: { supportCount: { increment: 1 } },
    });
    return res.json({ success: true, idea: updated });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to support idea', details: error.message });
  }
}
