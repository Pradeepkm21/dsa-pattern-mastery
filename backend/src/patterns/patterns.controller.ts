import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PatternsService } from './patterns.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('patterns')
@UseGuards(JwtAuthGuard)
export class PatternsController {
  constructor(private patternsService: PatternsService) {}

  @Get()
  async findAll() {
    return this.patternsService.findAll();
  }

  @Get(':slug')
  async findOne(
    @Param('slug') slug: string,
    @GetUser() user: { id: string },
  ) {
    return this.patternsService.findBySlug(slug, user.id);
  }
}
