import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const companies = await this.prisma.company.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { problems: true },
        },
      },
    });

    return companies.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      logoUrl: c.logoUrl,
      problemCount: c._count.problems,
    }));
  }

  async findBySlug(slug: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
      include: {
        problems: {
          where: { timeframe: 'all' },
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
        },
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with slug '${slug}' not found`);
    }

    const sortedProblems = company.problems
      .map((cp) => ({
        id: cp.problem.id,
        title: cp.problem.title,
        leetcodeUrl: cp.problem.leetcodeUrl,
        leetcodeProblemNumber: cp.problem.leetcodeProblemNumber,
        difficulty: cp.problem.difficulty,
        frequencyScore: cp.frequencyScore,
        patterns: cp.problem.patterns.map((pp) => ({
          id: pp.pattern.id,
          name: pp.pattern.name,
          slug: pp.pattern.slug,
          isPrimary: pp.isPrimary,
        })),
      }))
      .sort((a, b) => b.frequencyScore - a.frequencyScore);

    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      logoUrl: company.logoUrl,
      problems: sortedProblems,
    };
  }
}
