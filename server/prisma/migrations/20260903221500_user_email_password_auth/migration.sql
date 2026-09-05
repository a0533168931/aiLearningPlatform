-- Replace phone-based identity with unique email + passwordHash.
-- Existing users (if any) are given placeholder emails derived from phone
-- so the unique constraint can be applied without deleting rows.
-- Prompt/Category/SubCategory relations are unchanged.

-- AlterTable
ALTER TABLE "User" ADD COLUMN "email" TEXT;
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'USER';
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill unique emails for existing rows
UPDATE "User"
SET email = lower(regexp_replace(phone, '[^0-9A-Za-z]+', '', 'g')) || '@migrated.local'
WHERE email IS NULL AND phone IS NOT NULL;

UPDATE "User"
SET email = 'user-' || id::text || '@migrated.local'
WHERE email IS NULL;

-- Unusable bcrypt hash so leftover accounts cannot be logged into with a known password
UPDATE "User"
SET "passwordHash" = '$2b$10$PvgODTmJbmCTlR3UY/Juv.GfbEsCguL0fS/8KKt8jQPf.8U26HtO2'
WHERE "passwordHash" IS NULL;

ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

DROP INDEX "User_phone_key";
ALTER TABLE "User" DROP COLUMN "phone";
