import { zodSchema } from "@/shared/server/db/schema";
import { randPastDate, randUuid } from "@ngneat/falso";
import { z } from "zod";

export function createMockApplicationToDatabase(props: {
  jobId: string;
  userId: string;
}): z.infer<typeof zodSchema.Applications.insert> {
  return {
    jobId: props.jobId,
    userId: props.userId,
    id: randUuid(),
    status: getRandomStatus(),
    sentiment: getRandomSentiment(),
    appliedAt: randPastDate(),
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
