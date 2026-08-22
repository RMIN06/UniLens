import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const USER_ROLES = ["student", "general", "admin"] as const;
export const AUTH_PROVIDERS = ["credentials", "google"] as const;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name must be at most 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    image: { type: String },
    emailVerified: { type: Date, default: null },
    hashedPassword: {
      type: String,
      default: null,
      select: false,
    },
    providers: {
      type: [String],
      enum: AUTH_PROVIDERS,
      default: [],
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "general",
    },
    isStudent: {
      type: Boolean,
      default: false,
      index: true,
    },
    universityDomain: {
      type: String,
      default: null,
    },
    academicLevel: {
      type: String,
      enum: ["undergraduate", "graduate", null],
      default: null,
    },
    university: {
      type: String,
      trim: true,
      maxlength: [120, "University name must be at most 120 characters"],
      default: null,
    },
    program: {
      type: String,
      trim: true,
      maxlength: [120, "Program name must be at most 120 characters"],
      default: null,
    },
    graduationYear: {
      type: Number,
      min: [1990, "Graduation year must be 1990 or later"],
      max: [2100, "Graduation year must be 2100 or earlier"],
      default: null,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    secondaryStream: {
      type: String,
      enum: ["matriculation", "o-level", null],
      default: null,
    },
    secondaryGrade: {
      type: String,
      trim: true,
      maxlength: [20, "Grade must be at most 20 characters"],
      default: null,
    },
    higherStream: {
      type: String,
      enum: [
        "fsc-pre-medical",
        "fsc-pre-engineering",
        "ics",
        "fa",
        "a-level",
        "other",
        null,
      ],
      default: null,
      index: true,
    },
    higherGrade: {
      type: String,
      trim: true,
      maxlength: [20, "Grade must be at most 20 characters"],
      default: null,
    },
    lastLoginAt: { type: Date, default: null },
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, default: null, select: false },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ academicLevel: 1, onboardingCompleted: 1 });
UserSchema.index({ university: 1, program: 1 });

export type UserType = InferSchemaType<typeof UserSchema>;

function getUserModel(): Model<UserType> {
  if (mongoose.models.User) {
    return mongoose.models.User as Model<UserType>;
  }
  return mongoose.model<UserType>("User", UserSchema);
}

export const User = getUserModel();
