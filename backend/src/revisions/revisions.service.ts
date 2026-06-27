import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class RevisionsService {
  constructor(private prisma: PrismaService) {}

  async getDueProblems(userId: string) {
    const now = new Date();
    
    // Find all progress records where nextReviewAt <= now
    const progressRecords = await this.prisma.userProblemProgress.findMany({
      where: {
        userId,
        nextReviewAt: {
          lte: now,
        },
      },
      orderBy: {
        nextReviewAt: 'asc',
      },
      include: {
        problem: {
          include: {
            patterns: {
              include: {
                pattern: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return progressRecords.map((pr) => {
      const p = pr.problem;
      return {
        id: p.id,
        title: p.title,
        leetcodeUrl: p.leetcodeUrl,
        leetcodeProblemNumber: p.leetcodeProblemNumber,
        difficulty: p.difficulty,
        descriptionShort: p.descriptionShort,
        progress: {
          status: pr.status,
          confidenceLevel: pr.confidenceLevel,
          lastReviewedAt: pr.lastReviewedAt,
          nextReviewAt: pr.nextReviewAt,
          reviewCount: pr.reviewCount,
        },
        patterns: p.patterns.map((pp) => ({
          id: pp.pattern.id,
          name: pp.pattern.name,
          slug: pp.pattern.slug,
          isPrimary: pp.isPrimary,
        })),
      };
    });
  }

  async getDashboardStats(userId: string) {
    // 1. Get total problems count
    const totalProblemsCount = await this.prisma.problem.count();

    // 2. Get user solved problems count
    const solvedProblemsCount = await this.prisma.userProblemProgress.count({
      where: {
        userId,
        status: {
          in: [ProgressStatus.SOLVED, ProgressStatus.CONFIDENT],
        },
      },
    });

    // 3. Fetch all patterns with problems and user progress
    const patterns = await this.prisma.pattern.findMany({
      include: {
        problems: {
          include: {
            problem: {
              include: {
                progress: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    const progressByPattern = patterns.map((pat) => {
      const totalProblems = pat.problems.length;
      const solvedProblems = pat.problems.filter((pp) => {
        const prog = pp.problem.progress[0];
        return prog && (prog.status === ProgressStatus.SOLVED || prog.status === ProgressStatus.CONFIDENT);
      }).length;

      // Extract confidence levels
      const confidences = pat.problems
        .map((pp) => pp.problem.progress[0]?.confidenceLevel)
        .filter((c): c is number => typeof c === 'number' && c !== null);

      const averageConfidence =
        confidences.length > 0
          ? parseFloat((confidences.reduce((sum, val) => sum + val, 0) / confidences.length).toFixed(2))
          : null;

      return {
        id: pat.id,
        name: pat.name,
        slug: pat.slug,
        totalProblems,
        solvedProblems,
        averageConfidence,
      };
    });

    // 4. Calculate weakest areas (patterns sorted by average confidence, lowest first)
    // Only sort patterns that have at least one problem with an assigned confidence level.
    // If no confidence level is set, put them below/ignore or treat them as not attempted.
    const attemptedPatterns = progressByPattern.filter((p) => p.averageConfidence !== null);
    
    // Sort by confidence ascending (lowest confidence first)
    const weakestPatterns = [...attemptedPatterns].sort((a, b) => {
      return (a.averageConfidence ?? 0) - (b.averageConfidence ?? 0);
    });

    // If there are no attempted patterns, we can return the first 3 patterns as default recommendations
    const recommendedPatterns =
      weakestPatterns.length > 0
        ? weakestPatterns
        : progressByPattern.slice(0, 3);

    return {
      totalProblemsCount,
      solvedProblemsCount,
      progressByPattern,
      weakestPatterns: recommendedPatterns,
    };
  }
}
