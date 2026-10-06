// validation/auth.js
import { z } from 'zod';

// Define the schema using Zod
const registerSchema = z.object({
    // Define the registration schema with username and password fields
    username: z
        .string({ required_error: 'Username is required.' })
        .trim()
        .min(3, 'Username must be at least 3 characters.')
        .max(30, 'Username must be 30 characters or less.'),
    password: z
        .string({ required_error: 'Password is required.' })
        .min(6, 'Password must be at least 6 characters long.')
});

export const validateRegisterInput = (req, res, next) => {
    // Parse the incoming body against the Zod schema
    const result = registerSchema.safeParse(req.body);

    // If validation fails, intercept the request and return a 400 error
    if (!result.success) {
        // Grabs the very first validation error message from Zod
        const errorMessage = result.error.errors[0].message;
        return res.status(400).json({ error: errorMessage });
    }

    // Validation passed! Proceed to your controller logic safely
    next();
};
