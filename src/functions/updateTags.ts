import { app, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { devinApi } from '../lib/devin';
import { Session, ErrorResponse } from "../lib/types";

export async function updateTagsHandler(_message: unknown, context: InvocationContext): Promise<Session | ErrorResponse> {
    context.log('Updating tags for a Devin session...');

    const toolArgs = context.triggerMetadata.mcptoolargs as { sessionId?: string, tags?: string[] };

    const schema = z.object({
        sessionId: z.string().min(1),
        tags: z.array(z.string()),
    });
    const validationResult = schema.safeParse(toolArgs);

    if (!validationResult.success) {
        context.error("Validation failed", validationResult.error);
        return { error: "Invalid arguments", issues: validationResult.error.issues };
    }

    const { sessionId, tags } = validationResult.data;

    try {
        const session = await devinApi.put<Session>(`/sessions/${sessionId}/tags`, { tags });
        return session;
    } catch (error: any) {
        context.error('Error updating tags:', error);
        return { error: "Failed to update tags", details: error.message };
    }
}

app.mcpTool('updateTags', {
    toolName: 'updateTags',
    description: 'Updates the tags for a specific Devin session.',
    toolProperties: [
        {
            propertyName: 'sessionId',
            propertyType: 'string',
            description: 'The ID of the session to update.',
        },
        {
            propertyName: 'tags',
            propertyType: 'array',
            description: 'The new array of tags.',
        }
    ],
    handler: updateTagsHandler
});