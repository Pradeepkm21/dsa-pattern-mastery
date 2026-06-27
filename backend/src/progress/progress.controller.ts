import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { AddMistakeDto } from './dto/add-mistake.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('problems/:id')
  async getProblem(
    @Param('id') problemId: string,
    @GetUser() user: { id: string },
  ) {
    return this.progressService.findOneProblem(problemId, user.id);
  }

  @Post('progress/:problemId')
  async updateProgress(
    @Param('problemId') problemId: string,
    @GetUser() user: { id: string },
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progressService.updateProgress(problemId, user.id, dto);
  }

  @Post('progress/:problemId/mistake')
  async addMistake(
    @Param('problemId') problemId: string,
    @GetUser() user: { id: string },
    @Body() dto: AddMistakeDto,
  ) {
    return this.progressService.addMistake(problemId, user.id, dto.text);
  }

  @Post('progress/:problemId/review')
  async markReviewed(
    @Param('problemId') problemId: string,
    @GetUser() user: { id: string },
  ) {
    return this.progressService.markReviewed(problemId, user.id);
  }
}
