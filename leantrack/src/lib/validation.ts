import { z } from 'zod';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Schema for a weight log entry.
 */
export const weightLogSchema = z.object({
  weight_lb: z
    .number({ required_error: 'Weight is required' })
    .min(50, 'Weight must be at least 50 lbs')
    .max(800, 'Weight must be at most 800 lbs'),
  date: z
    .string()
    .regex(DATE_REGEX, 'Date must be in YYYY-MM-DD format'),
});

export type WeightLogInput = z.infer<typeof weightLogSchema>;

/**
 * Schema for a calorie log entry.
 */
export const calorieLogSchema = z.object({
  calories_consumed: z
    .number()
    .int('Calories must be a whole number')
    .min(0, 'Calories cannot be negative')
    .max(15000, 'Calories cannot exceed 15,000')
    .nullable(),
  date: z
    .string()
    .regex(DATE_REGEX, 'Date must be in YYYY-MM-DD format'),
});

export type CalorieLogInput = z.infer<typeof calorieLogSchema>;

/**
 * Schema for a single set log entry.
 */
export const setLogSchema = z.object({
  weight_lb: z
    .number()
    .min(0, 'Weight cannot be negative')
    .max(2000, 'Weight cannot exceed 2000 lbs')
    .nullable(),
  reps: z
    .number({ required_error: 'Reps are required' })
    .int('Reps must be a whole number')
    .min(0, 'Reps cannot be negative')
    .max(999, 'Reps cannot exceed 999'),
  rpe: z
    .number()
    .min(1, 'RPE must be at least 1')
    .max(10, 'RPE must be at most 10')
    .nullable(),
});

export type SetLogInput = z.infer<typeof setLogSchema>;

/**
 * Schema for the user profile form.
 */
export const profileSchema = z.object({
  height_inches: z
    .number({ required_error: 'Height is required' })
    .min(36, 'Height must be at least 36 inches')
    .max(96, 'Height must be at most 96 inches'),
  starting_weight: z
    .number({ required_error: 'Starting weight is required' })
    .min(50, 'Weight must be at least 50 lbs')
    .max(800, 'Weight must be at most 800 lbs'),
  goal_weight: z
    .number({ required_error: 'Goal weight is required' })
    .min(50, 'Weight must be at least 50 lbs')
    .max(800, 'Weight must be at most 800 lbs'),
  timezone: z
    .string()
    .min(1, 'Timezone is required'),
  units: z.enum(['imperial', 'metric'], {
    required_error: 'Units preference is required',
  }),
});

export type ProfileInput = z.infer<typeof profileSchema>;
