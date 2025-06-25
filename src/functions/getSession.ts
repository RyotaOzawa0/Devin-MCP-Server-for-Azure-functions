import { app, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { devinApi } from '../lib/devin';

export async function getSessionHandler(_message: unknown, context: InvocationContext): Promise<any> {
    context.log('Getting a specific Devin session...');

    const toolArgs = context.triggerMetadata.mcptoolargs as { sessionId?: string };

    const schema = z.object({ sessionId: z.string().min(1) });
    const validationResult = schema.safeParse(toolArgs);

    if (!validationResult.success) {
        context.error("Validation failed", validationResult.error);
        return { error: "Invalid arguments", issues: validationResult.error.issues };
    }

    const { sessionId } = validationResult.data;

    try {
        const response = await devinApi.get(`/sessions/${sessionId}`);
        return response.data;
    } catch (error: any) {
        context.error('Error getting session:', error);
        return { error: "Failed to get session", details: error.message };
    }
}

app.mcpTool('getSession', {
    toolName: 'getSession',
    description: 'Gets the details of a specific Devin session.',
    toolProperties: [
        {
            propertyName: 'sessionId',
            propertyType: 'string',
            description: 'The ID of the session to retrieve.',
        }
    ],
    handler: getSessionHandler
});