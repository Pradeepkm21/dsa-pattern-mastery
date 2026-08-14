import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PatternsService } from './patterns.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('patterns')
export class PatternsController {
  constructor(private patternsService: PatternsService) {}

  @Get()
  async findAll() {
    return this.patternsService.findAll();
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('slug') slug: string,
    @GetUser() user?: { id: string },
  ) {
    return this.patternsService.findBySlug(slug, user?.id);
  }
}
