import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatternsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Only return the Array group patterns for now, ordered by displayOrder
    return this.prisma.pattern.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
      include: {
        patternGroup: true,
      },
    });
  }

  async findBySlug(slug: string, userId: string) {
    const pattern = await this.prisma.pattern.findUnique({
      where: { slug },
      include: {
        problems: {
          include: {
            problem: {
              include: {
                progress: {
                  where: { userId },
                },
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
                companies: {
                  include: {
                    company: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!pattern) {
      throw new NotFoundException(`Pattern with slug '${slug}' not found`);
    }

    // Format the problems output to make it easier for the frontend
    const formattedProblems = pattern.problems.map((pp) => {
      const p = pp.problem;
      const userProgress = p.progress[0] || null;
      return {
        id: p.id,
        title: p.title,
        leetcodeUrl: p.leetcodeUrl,
        leetcodeProblemNumber: p.leetcodeProblemNumber,
        difficulty: p.difficulty,
        descriptionShort: p.descriptionShort,
        isPrimary: pp.isPrimary,
        progress: userProgress
          ? {
              status: userProgress.status,
              confidenceLevel: userProgress.confidenceLevel,
              lastReviewedAt: userProgress.lastReviewedAt,
              nextReviewAt: userProgress.nextReviewAt,
              reviewCount: userProgress.reviewCount,
            }
          : {
              status: 'NOT_STARTED',
              confidenceLevel: null,
              lastReviewedAt: null,
              nextReviewAt: null,
              reviewCount: 0,
            },
        allPatterns: p.patterns.map((otherPp) => ({
          id: otherPp.pattern.id,
          name: otherPp.pattern.name,
          slug: otherPp.pattern.slug,
          isPrimary: otherPp.isPrimary,
        })),
        companies: p.companies
          ? p.companies.map((cp) => ({
              companyName: cp.company.name,
              companySlug: cp.company.slug,
              frequencyScore: cp.frequencyScore,
              timeframe: cp.timeframe,
            }))
          : [],
      };
    });

    return {
      id: pattern.id,
      name: pattern.name,
      slug: pattern.slug,
      triggerCue: pattern.triggerCue,
      coreIdea: pattern.coreIdea,
      whyItWorks: pattern.whyItWorks,
      codeSkeleton: pattern.codeSkeleton,
      timeComplexity: pattern.timeComplexity,
      spaceComplexity: pattern.spaceComplexity,
      commonMistake: pattern.commonMistake,
      comparisonNotes: pattern.comparisonNotes,
      displayOrder: pattern.displayOrder,
      problems: formattedProblems,
    };
  }
}
