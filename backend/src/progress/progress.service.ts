import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async findOneProblem(problemId: string, userId: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { id: problemId },
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
        progress: {
          where: { userId },
        },
      },
    });

    if (!problem) {
      throw new NotFoundException(`Problem with ID '${problemId}' not found`);
    }

    const userProgress = problem.progress[0] || null;

    return {
      id: problem.id,
      title: problem.title,
      leetcodeUrl: problem.leetcodeUrl,
      leetcodeProblemNumber: problem.leetcodeProblemNumber,
      difficulty: problem.difficulty,
      descriptionShort: problem.descriptionShort,
      patterns: problem.patterns.map((pp) => ({
        id: pp.pattern.id,
        name: pp.pattern.name,
        slug: pp.pattern.slug,
        isPrimary: pp.isPrimary,
      })),
      progress: userProgress
        ? {
            status: userProgress.status,
            confidenceLevel: userProgress.confidenceLevel,
            dryRunNotes: userProgress.dryRunNotes,
            whyNotes: userProgress.whyNotes,
            mistakeLog: userProgress.mistakeLog,
            freeNotes: userProgress.freeNotes,
            lastReviewedAt: userProgress.lastReviewedAt,
            nextReviewAt: userProgress.nextReviewAt,
            reviewCount: userProgress.reviewCount,
          }
        : {
            status: ProgressStatus.NOT_STARTED,
            confidenceLevel: null,
            dryRunNotes: '',
            whyNotes: '',
            mistakeLog: [],
            freeNotes: '',
            lastReviewedAt: null,
            nextReviewAt: null,
            reviewCount: 0,
          },
    };
  }

  async updateProgress(problemId: string, userId: string, dto: UpdateProgressDto) {
    // Verify problem exists
    const problem = await this.prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      throw new NotFoundException(`Problem with ID '${problemId}' not found`);
    }

    return this.prisma.userProblemProgress.upsert({
      where: {
        userId_problemId: { userId, problemId },
      },
      update: {
        status: dto.status,
        confidenceLevel: dto.confidenceLevel ?? null,
        dryRunNotes: dto.dryRunNotes ?? '',
        whyNotes: dto.whyNotes ?? '',
        freeNotes: dto.freeNotes ?? null,
      },
      create: {
        userId,
        problemId,
        status: dto.status,
        confidenceLevel: dto.confidenceLevel ?? null,
        dryRunNotes: dto.dryRunNotes ?? '',
        whyNotes: dto.whyNotes ?? '',
        freeNotes: dto.freeNotes ?? null,
        mistakeLog: [],
      },
    });
  }

  async addMistake(problemId: string, userId: string, text: string) {
    // Verify problem exists
    const problem = await this.prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      throw new NotFoundException(`Problem with ID '${problemId}' not found`);
    }

    const progress = await this.prisma.userProblemProgress.findUnique({
      where: {
        userId_problemId: { userId, problemId },
      },
    });

    let log: Array<{ timestamp: string; text: string }> = [];
    if (progress && progress.mistakeLog) {
      try {
        const parsed = progress.mistakeLog;
        if (Array.isArray(parsed)) {
          log = parsed as Array<{ timestamp: string; text: string }>;
        }
      } catch (e) {
        log = [];
      }
    }

    log.push({
      timestamp: new Date().toISOString(),
      text,
    });

    return this.prisma.userProblemProgress.upsert({
      where: {
        userId_problemId: { userId, problemId },
      },
      update: {
        mistakeLog: log,
      },
      create: {
        userId,
        problemId,
        status: ProgressStatus.NOT_STARTED,
        mistakeLog: log,
        dryRunNotes: '',
        whyNotes: '',
      },
    });
  }

  async markReviewed(problemId: string, userId: string) {
    // Verify problem exists
    const problem = await this.prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      throw new NotFoundException(`Problem with ID '${problemId}' not found`);
    }

    const progress = await this.prisma.userProblemProgress.findUnique({
      where: {
        userId_problemId: { userId, problemId },
      },
    });

    const currentCount = progress ? progress.reviewCount : 0;
    const newCount = currentCount + 1;
    const confidence = progress ? progress.confidenceLevel : null;
    const now = new Date();

    let daysToAdd = 3;
    if (confidence === 1 || confidence === 2) {
      daysToAdd = 3; // Reset to 3 days if confidence is low
    } else {
      if (newCount === 1) daysToAdd = 3;
      else if (newCount === 2) daysToAdd = 7;
      else if (newCount === 3) daysToAdd = 14;
      else daysToAdd = 30; // 4th review onwards -> +30 days
    }

    const nextReviewAt = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    return this.prisma.userProblemProgress.upsert({
      where: {
        userId_problemId: { userId, problemId },
      },
      update: {
        reviewCount: newCount,
        lastReviewedAt: now,
        nextReviewAt: nextReviewAt,
      },
      create: {
        userId,
        problemId,
        status: ProgressStatus.NOT_STARTED,
        reviewCount: newCount,
        lastReviewedAt: now,
        nextReviewAt: nextReviewAt,
        mistakeLog: [],
        dryRunNotes: '',
        whyNotes: '',
      },
    });
  }
}
