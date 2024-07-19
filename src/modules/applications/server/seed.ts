import { zodSchema } from "@/shared/server/db/schema";
import { randPastDate, randRecentDate } from "@ngneat/falso";
import { z } from "zod";

export function createMockApplicationToDatabase(props: {
  jobId: string;
  userId: string;
}): z.infer<typeof zodSchema.Applications.insert> {
  return {
    jobId: props.jobId,
    userId: props.userId,
    status: getRandomStatus(),
    sentiment: getRandomSentiment(),
    appliedAt: randRecentDate({ days: 45 }),
    updatedAt: randPastDate(),
  };
}

function getRandomSentiment() {
  const sentiments = ["low", "medium", "high"];
  return sentiments[Math.floor(Math.random() * sentiments.length)];
}

function getRandomStatus() {
  const statuses = [
    "applied",
    "not-started",
    "interview",
    "rejected",
    "interviewing",
    "expired",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
}
