import { z } from 'zod';

// Define the validation rules matching your Mongoose strict lengths
export const createEntrySchema = z.object({
    displayName: z
        .string({ required_error: 'Display name is required.' })
        .trim()
        .min(1, 'Display name cannot be empty.')
        .max(50, 'Display name must be 50 characters or less.'),
    
    message: z
        .string({ required_error: 'Message is required.' })
        .trim()
        .min(1, 'Message cannot be empty.')
        .max(500, 'Message must be 500 characters or less.'),
});
