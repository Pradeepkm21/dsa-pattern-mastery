import { Module } from '@nestjs/common';
import { PatternsService } from './patterns.service';
import { PatternsController } from './patterns.controller';

@Module({
  providers: [PatternsService],
  controllers: [PatternsController],
})
export class PatternsModule {}
