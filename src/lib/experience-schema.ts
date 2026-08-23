import { z } from "zod";

const rating = z.number().int().min(1).max(10);

export const experienceSchema = z.object({
  title: z.string().trim().min(10, "Give your experience a short title (10+ characters)").max(120),
  overallRating: rating,
  recommendation: z.enum([
    "highly-recommend",
    "recommend",
    "neutral",
    "not-recommended",
  ]),
  wouldChooseAgain: z.enum(["yes", "maybe", "no"]).nullable().optional(),
  categoryRatings: z
    .object({
      academics: rating.optional(),
      campusLife: rating.optional(),
      facilities: rating.optional(),
      societies: rating.optional(),
    })
    .optional(),
  story: z
    .string()
    .trim()
    .min(150, "Tell us more — at least 150 characters. Detailed reviews help juniors the most.")
    .max(5000),
  pros: z.array(z.string().trim().min(2).max(150)).max(5).optional(),
  cons: z.array(z.string().trim().min(2).max(150)).max(5).optional(),
  advice: z.string().trim().max(1500).optional(),
  outcome: z
    .object({
      status: z.enum([
        "employed",
        "higher-study",
        "entrepreneurship",
        "still-searching",
        "other",
      ]),
      details: z.string().trim().max(800).optional(),
      fieldRelevance: z.enum(["directly", "partially", "not"]),
    })
    .nullable()
    .optional(),
  anonymous: z.boolean().optional(),
});
