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

export const validateCreateEntryInput = (req, res, next) => {
    // Parse the incoming body against the Zod schema
    const result = createEntrySchema.safeParse(req.body);

    // If validation fails, intercept the request and return a 400 error
    if (!result.success) {
        // Grabs the very first validation error message from Zod
        const errorMessage = result.error.errors[0].message;
        return res.status(400).json({ error: errorMessage });
    }

    // Validation passed! Proceed to your controller logic safely
    next();
};