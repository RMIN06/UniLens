import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const OutcomeSchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "employed",
        "higher-study",
        "entrepreneurship",
        "still-searching",
        "other",
      ],
    },
    details: { type: String, trim: true, maxlength: 800 },
    fieldRelevance: {
      type: String,
      enum: ["directly", "partially", "not"],
    },
  },
  { _id: false }
);

const ExperienceSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    academicLevel: {
      type: String,
      enum: ["undergraduate", "graduate"],
      required: true,
      index: true,
    },
    university: { type: String, required: true, trim: true },
    program: { type: String, required: true, trim: true },
    graduationYear: { type: Number },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 120,
    },
    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    recommendation: {
      type: String,
      required: true,
      enum: ["highly-recommend", "recommend", "neutral", "not-recommended"],
    },
    wouldChooseAgain: {
      type: String,
      enum: ["yes", "maybe", "no"],
      default: null,
    },
    categoryRatings: {
      academics: { type: Number, min: 1, max: 10 },
      campusLife: { type: Number, min: 1, max: 10 },
      facilities: { type: Number, min: 1, max: 10 },
      societies: { type: Number, min: 1, max: 10 },
    },
    story: {
      type: String,
      required: true,
      trim: true,
      minlength: 150,
      maxlength: 5000,
    },
    pros: { type: [String], default: [] },
    cons: { type: [String], default: [] },
    advice: { type: String, trim: true, maxlength: 1500, default: "" },
    outcome: { type: OutcomeSchema, default: null },
    anonymous: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    helpfulVotedBy: { type: [Schema.Types.ObjectId], default: [], select: false },
    editedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "experiences",
  }
);

ExperienceSchema.index({ university: 1, program: 1 });
ExperienceSchema.index({ createdAt: -1 });
ExperienceSchema.index({ helpfulCount: -1 });

export type ExperienceType = InferSchemaType<typeof ExperienceSchema>;

function getExperienceModel(): Model<ExperienceType> {
  if (mongoose.models.Experience) {
    return mongoose.models.Experience as Model<ExperienceType>;
  }
  return mongoose.model<ExperienceType>("Experience", ExperienceSchema);
}

export const Experience = getExperienceModel();
