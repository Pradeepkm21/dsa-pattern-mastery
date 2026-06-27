import { Controller, Get, UseGuards } from '@nestjs/common';
import { RevisionsService } from './revisions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('revisions')
@UseGuards(JwtAuthGuard)
export class RevisionsController {
  constructor(private revisionsService: RevisionsService) {}

  @Get('due')
  async getDue(@GetUser() user: { id: string }) {
    return this.revisionsService.getDueProblems(user.id);
  }

  @Get('dashboard')
  async getDashboard(@GetUser() user: { id: string }) {
    return this.revisionsService.getDashboardStats(user.id);
  }
}
