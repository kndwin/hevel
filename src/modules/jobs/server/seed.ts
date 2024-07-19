import { z } from "zod";
import { zodSchema } from "@/shared/server/db/schema";
import {
  randCity,
  randCompanyName,
  randJobTitle,
  randNumber,
  randParagraph,
  randPastDate,
  randProgrammingLanguage,
  randSentence,
  randUrl,
} from "@ngneat/falso";

export function createMockJobToDatabase(): z.infer<
  typeof zodSchema.Jobs.insert
> {
  return {
    company: randCompanyName(),
    title: randJobTitle(),
    location: randCity(),
    salary: randNumber({ min: 100000, max: 150000 }),
    source: randCompanyName(),
    sourceUrl: randUrl(),
    techStack: Array.from({ length: 2 + Math.floor(Math.random() * 5) }, () =>
      randProgrammingLanguage()
    )
      .join(",")
      .replace(/,$/, ""),
    descriptionInHTML: getMockJobDescription(),
    createdAt: randPastDate(),
    updatedAt: randPastDate(),
  };
}

function getMockJobDescription() {
  function h1(text: string) {
    return `<h1>${text}</h1>\n`;
  }

  function h2(text: string) {
    return `<h2>${text}</h2>\n`;
  }

  function p(text: string) {
    return `<p>${text}</p>\n`;
  }

  return (
    h1(randJobTitle()) +
    p(randParagraph()) +
    h2(randSentence()) +
    p(randParagraph()) +
    p(randParagraph()) +
    h2(randSentence()) +
    p(randParagraph()) +
    p(randParagraph()) +
    h2(randSentence()) +
    p(randParagraph()) +
    p(randParagraph()) +
    p(randParagraph())
  );
}
