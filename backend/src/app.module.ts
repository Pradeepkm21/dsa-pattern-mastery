import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatternsModule } from './patterns/patterns.module';
import { ProgressModule } from './progress/progress.module';
import { RevisionsModule } from './revisions/revisions.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PatternsModule,
    ProgressModule,
    RevisionsModule,
    CompaniesModule,
  ],
})
export class AppModule {}
