import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './progress.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('ProgressService', () => {
  let service: ProgressService;
  let prisma: PrismaService;

  const mockPrismaService = {
    problem: {
      findUnique: jest.fn(),
    },
    userProblemProgress: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('markReviewed', () => {
    it('should throw NotFoundException if problem does not exist', async () => {
      mockPrismaService.problem.findUnique.mockResolvedValue(null);

      await expect(service.markReviewed('invalid-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should set nextReviewAt to +3 days for the first review', async () => {
      mockPrismaService.problem.findUnique.mockResolvedValue({ id: 'problem-1' });
      mockPrismaService.userProblemProgress.findUnique.mockResolvedValue(null); // No existing progress
      mockPrismaService.userProblemProgress.upsert.mockImplementation((args) => args.create);

      const result = await service.markReviewed('problem-1', 'user-1');

      expect(result.reviewCount).toBe(1);
      expect(result.lastReviewedAt).toBeInstanceOf(Date);
      expect(result.nextReviewAt).toBeInstanceOf(Date);

      // Verify date difference is approximately 3 days
      const diffMs = result.nextReviewAt.getTime() - result.lastReviewedAt.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(3);
    });

    it('should set nextReviewAt to +7 days for the second review if confidence is high', async () => {
      mockPrismaService.problem.findUnique.mockResolvedValue({ id: 'problem-1' });
      mockPrismaService.userProblemProgress.findUnique.mockResolvedValue({
        userId: 'user-1',
        problemId: 'problem-1',
        reviewCount: 1,
        confidenceLevel: 4, // High confidence
      });
      mockPrismaService.userProblemProgress.upsert.mockImplementation((args) => args.update);

      const result = await service.markReviewed('problem-1', 'user-1');

      expect(prisma.userProblemProgress.upsert).toHaveBeenCalled();
      const upsertArgs = mockPrismaService.userProblemProgress.upsert.mock.calls[0][0];
      
      expect(upsertArgs.update.reviewCount).toBe(2);
      const diffMs = upsertArgs.update.nextReviewAt.getTime() - upsertArgs.update.lastReviewedAt.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(7);
    });

    it('should reset nextReviewAt to +3 days if confidence level is low (1 or 2) during review', async () => {
      mockPrismaService.problem.findUnique.mockResolvedValue({ id: 'problem-1' });
      mockPrismaService.userProblemProgress.findUnique.mockResolvedValue({
        userId: 'user-1',
        problemId: 'problem-1',
        reviewCount: 3,
        confidenceLevel: 2, // Low confidence
      });
      mockPrismaService.userProblemProgress.upsert.mockImplementation((args) => args.update);

      await service.markReviewed('problem-1', 'user-1');

      const upsertArgs = mockPrismaService.userProblemProgress.upsert.mock.calls[0][0];
      
      // Even though it is the 4th review (would normally be +30 days), low confidence resets it to +3 days
      expect(upsertArgs.update.reviewCount).toBe(4);
      const diffMs = upsertArgs.update.nextReviewAt.getTime() - upsertArgs.update.lastReviewedAt.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(3);
    });
  });

  describe('addMistake', () => {
    it('should append a new timestamped mistake entry to mistakeLog without overwriting', async () => {
      mockPrismaService.problem.findUnique.mockResolvedValue({ id: 'problem-1' });
      
      // Seed with one existing mistake
      const existingLog = [{ timestamp: '2026-06-20T00:00:00.000Z', text: 'Off-by-one error' }];
      mockPrismaService.userProblemProgress.findUnique.mockResolvedValue({
        userId: 'user-1',
        problemId: 'problem-1',
        mistakeLog: existingLog,
      });

      mockPrismaService.userProblemProgress.upsert.mockImplementation((args) => args.update);

      await service.addMistake('problem-1', 'user-1', 'Infinite loop due to loop condition');

      expect(prisma.userProblemProgress.upsert).toHaveBeenCalled();
      const upsertArgs = mockPrismaService.userProblemProgress.upsert.mock.calls[0][0];
      
      const newLog = upsertArgs.update.mistakeLog;
      expect(newLog.length).toBe(2);
      expect(newLog[0].text).toBe('Off-by-one error');
      expect(newLog[1].text).toBe('Infinite loop due to loop condition');
      expect(newLog[1].timestamp).toBeDefined();
    });
  });
});
