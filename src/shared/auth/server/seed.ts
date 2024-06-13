import { zodSchema } from "@/shared/server/db/schema";
import {
  randAvatar,
  randEmail,
  randFullName,
  randOAuthProvider,
  randUuid,
} from "@ngneat/falso";
import { z } from "zod";

export function createMockOauth(): z.infer<typeof zodSchema.User.insert> {
  return {
    avatarUrl: randAvatar(),
    id: randUuid(),
    name: randFullName(),
    email: randEmail(),
  };
}

export function createMockUser(): z.infer<typeof zodSchema.Oauth.insert> {
  return {
    providerId: randOAuthProvider(),
    providerUserId: randUuid(),
    userId: randUuid(),
  };
}
