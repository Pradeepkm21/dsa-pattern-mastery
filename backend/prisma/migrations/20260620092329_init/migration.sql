-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'ATTEMPTED', 'SOLVED', 'CONFIDENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pattern_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "pattern_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patterns" (
    "id" TEXT NOT NULL,
    "pattern_group_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "trigger_cue" TEXT NOT NULL,
    "core_idea" TEXT NOT NULL,
    "why_it_works" TEXT NOT NULL,
    "code_skeleton" TEXT NOT NULL,
    "time_complexity" TEXT NOT NULL,
    "space_complexity" TEXT NOT NULL,
    "common_mistake" TEXT NOT NULL,
    "comparison_notes" TEXT,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "leetcode_url" TEXT NOT NULL,
    "leetcode_problem_number" INTEGER,
    "difficulty" "Difficulty" NOT NULL,
    "description_short" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_patterns" (
    "problem_id" TEXT NOT NULL,
    "pattern_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "problem_patterns_pkey" PRIMARY KEY ("problem_id","pattern_id")
);

-- CreateTable
CREATE TABLE "user_problem_progresses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "confidence_level" INTEGER,
    "dry_run_notes" TEXT NOT NULL DEFAULT '',
    "why_notes" TEXT NOT NULL DEFAULT '',
    "mistake_log" JSONB NOT NULL DEFAULT '[]',
    "free_notes" TEXT,
    "last_reviewed_at" TIMESTAMP(3),
    "next_review_at" TIMESTAMP(3),
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_problem_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pattern_groups_slug_key" ON "pattern_groups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "patterns_slug_key" ON "patterns"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_problem_progresses_user_id_problem_id_key" ON "user_problem_progresses"("user_id", "problem_id");

-- AddForeignKey
ALTER TABLE "patterns" ADD CONSTRAINT "patterns_pattern_group_id_fkey" FOREIGN KEY ("pattern_group_id") REFERENCES "pattern_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_patterns" ADD CONSTRAINT "problem_patterns_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_patterns" ADD CONSTRAINT "problem_patterns_pattern_id_fkey" FOREIGN KEY ("pattern_id") REFERENCES "patterns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_problem_progresses" ADD CONSTRAINT "user_problem_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_problem_progresses" ADD CONSTRAINT "user_problem_progresses_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
