import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { AddMistakeDto } from './dto/add-mistake.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller()
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('problems/:id')
  @UseGuards(OptionalJwtAuthGuard)
  async getProblem(
    @Param('id') problemId: string,
    @GetUser() user?: { id: string },
  ) {
    return this.progressService.findOneProblem(problemId, user?.id);
  }

  @Post('progress/:problemId')
  @UseGuards(JwtAuthGuard)
  async updateProgress(
    @Param('problemId') problemId: string,
    @GetUser() user: { id: string },
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progressService.updateProgress(problemId, user.id, dto);
  }

  @Post('progress/:problemId/mistake')
  @UseGuards(JwtAuthGuard)
  async addMistake(
    @Param('problemId') problemId: string,
    @GetUser() user: { id: string },
    @Body() dto: AddMistakeDto,
  ) {
    return this.progressService.addMistake(problemId, user.id, dto.text);
  }

  @Post('progress/:problemId/review')
  @UseGuards(JwtAuthGuard)
  async markReviewed(
    @Param('problemId') problemId: string,
    @GetUser() user: { id: string },
  ) {
    return this.progressService.markReviewed(problemId, user.id);
  }
}
