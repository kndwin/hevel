import { zodSchema } from "@/shared/server/db/schema";
import {
  randParagraph,
  randPastDate,
  randRecentDate,
  randSentence,
  randJobTitle,
} from "@ngneat/falso";
import { z } from "zod";

export function createMockBaseResumeToDatabase(props: {
  userId: string;
}): z.infer<typeof zodSchema.BaseResumes.insert> {
  return {
    userId: props.userId,
    title: randJobTitle(),
    content: mockBaseResumeContent,
    createdAt: randRecentDate({ days: 45 }),
    updatedAt: randPastDate(),
  };
}

const mockBaseResumeContent = `
# Jane Doe
Frontend Engineer | React Specialist
email@example.com | (555) 123-4567 | github.com/janedoe

## Summary
Passionate frontend engineer with 5+ years of experience, specializing in React and modern web technologies. Committed to creating efficient, scalable, and user-friendly web applications.

## Experience

### Senior Frontend Engineer | TechCorp Inc.
*July 2020 - Present*
- Led development of a high-traffic e-commerce platform using React, resulting in a 40% increase in user engagement
- Implemented responsive design principles, improving mobile conversion rates by 25%
- Mentored junior developers and conducted code reviews to ensure best practices

### Frontend Developer | WebSolutions LLC
*March 2018 - June 2020*
- Developed and maintained multiple client websites using React and Redux
- Collaborated with UX designers to implement intuitive user interfaces
- Optimized application performance, reducing load times by 30%

## Education

### Bachelor of Science in Computer Science
University of Technology | Graduated: May 2018

## Skills

- **React & Redux**: Expert-level proficiency in building complex, state-managed applications
- **JavaScript/ES6+**: Strong understanding of core language concepts and modern features
- **CSS3 & Sass**: Advanced styling techniques and responsive design implementation
`;

export function createMockTailoredResumeToDatabase(props: {
  userId: string;
  baseResumeId: string;
}): z.infer<typeof zodSchema.TailoredResume.insert> {
  return {
    baseResumeId: props.baseResumeId,
    userId: props.userId,
    title: randJobTitle(),
    content: randParagraph(),
    createdAt: randRecentDate({ days: 45 }),
    updatedAt: randPastDate(),
  };
}
