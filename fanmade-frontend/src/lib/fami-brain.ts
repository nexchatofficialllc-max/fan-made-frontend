export type FamiBrainResult = {
  reply: string;
  needsHuman: boolean;
};

const LOOPA_KNOWLEDGE = `
LOOPA is a fan-focused platform where people can watch original fan-created
anime and video works and connect with other fans.

LOOPA has fan and creator experiences. Users have one permanent account UID.
The public username is used publicly; the private UID should not be publicly
displayed.

LOOPA includes watching, likes, comments, replies, watchlists, notifications,
creator features, profiles, privacy, security, and settings.

Fami is LOOPA's AI support assistant. Fami helps users understand LOOPA and
solve ordinary problems. Fami can connect users with the official LOOPA
Support Team when human help is needed.

The LOOPA Support Team is made of human support staff and is separate from
Fami.
`;

const FAMI_SAFETY = `
Fami must protect private information and must never ask for passwords,
authentication codes, recovery codes, secret keys, or another person's
private information.

Fami must not invent LOOPA policies, account information, moderation decisions,
security information, or technical facts.

Fami must not help users bypass authentication, account restrictions, device
limits, privacy protections, age protections, moderation, or other security
controls.

Fami must clearly identify herself as an AI assistant and must never pretend
to be a human support worker.

When Fami does not have enough reliable information, she should say so and
offer the LOOPA Support Team when appropriate.

Serious account-security problems, complicated account problems, moderation
appeals, and issues Fami cannot reliably resolve should be passed to human
support.
`;

export function getFamiBrainContext(): string {
  return `${LOOPA_KNOWLEDGE}\\n\\n${FAMI_SAFETY}`;
}

export function getFamiLocalReply(message: string): FamiBrainResult {
  const text = message.trim().toLowerCase();

  if (!text) {
    return {
      reply: "I'm listening 🌸",
      needsHuman: false,
    };
  }

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.startsWith("hi ") ||
    text.startsWith("hello ")
  ) {
    return {
      reply: "Heyyy! 🌸 I'm Fami. What can I help you with?",
      needsHuman: false,
    };
  }

  if (
    text.includes("who are you") ||
    text.includes("what are you") ||
    text.includes("what is fami")
  ) {
    return {
      reply:
        "I'm Fami 🌸 LOOPA's AI support assistant. I can help you understand LOOPA, work through problems, and connect you with the LOOPA Support Team when a human is needed.",
      needsHuman: false,
    };
  }

  if (
    text.includes("password") ||
    text.includes("verification code") ||
    text.includes("recovery code") ||
    text.includes("api key") ||
    text.includes("secret key")
  ) {
    return {
      reply:
        "I can't help expose or bypass private security information. 🔒 If you're having an account-security problem, I can connect you with the LOOPA Support Team.",
      needsHuman: true,
    };
  }

  if (
    text.includes("someone hacked") ||
    text.includes("account hacked") ||
    text.includes("someone accessed my account") ||
    text.includes("my account was stolen")
  ) {
    return {
      reply:
        "That sounds like an account-security issue. 🔒 I don't want to guess about something this important. The LOOPA Support Team should take a look.",
      needsHuman: true,
    };
  }

  if (
    text.includes("thank you") ||
    text.includes("thanks") ||
    text === "thank"
  ) {
    return {
      reply: "Anytime! 🌸",
      needsHuman: false,
    };
  }

  return {
    reply:
      "Hmm, I want to give you the right answer rather than make one up. 🌸 Tell me a little more about what's happening, and I'll see what I can help with.",
    needsHuman: false,
  };
}
