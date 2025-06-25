
import { app, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { devinApi } from '../lib/devin';
import { Session, ErrorResponse } from "../lib/types";

// Define the handler function
export async function createSessionHandler(_message: unknown, context: InvocationContext): Promise<Session | ErrorResponse> {
    context.log('Creating a new Devin session...');

    const toolArgs = context.triggerMetadata.mcptoolargs as { task?: string };
    
    const schema = z.object({ task: z.string().min(1) });
    const validationResult = schema.safeParse(toolArgs);

    if (!validationResult.success) {
        context.error("Validation failed", validationResult.error);
        return { error: "Invalid arguments", issues: validationResult.error.issues };
    }

    const { task } = validationResult.data;

    try {
        const session = await devinApi.post<Session>('/sessions', { task });
        return session;
    } catch (error: any) {
        context.error('Error creating session:', error);
        return { error: "Failed to create session", details: error.message };
    }
}

// Register the tool
app.mcpTool('createSession', {
    toolName: 'createSession',
    description: 'Creates a new Devin session.',
    toolProperties: [
        {
            propertyName: 'task',
            propertyType: 'string',
            description: 'The initial task for the Devin session.',
        }
    ],
    handler: createSessionHandler
});
