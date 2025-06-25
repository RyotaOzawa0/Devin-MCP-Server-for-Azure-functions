
import { app, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { devinApi } from '../lib/devin';

export async function sendMessageHandler(_message: unknown, context: InvocationContext): Promise<any> {
    context.log('Sending a message to a Devin session...');

    const toolArgs = context.triggerMetadata.mcptoolargs as { sessionId?: string, message?: string };

    const schema = z.object({
        sessionId: z.string().min(1),
        message: z.string().min(1),
    });
    const validationResult = schema.safeParse(toolArgs);

    if (!validationResult.success) {
        context.error("Validation failed", validationResult.error);
        return { error: "Invalid arguments", issues: validationResult.error.issues };
    }

    const { sessionId, message } = validationResult.data;

    try {
        const response = await devinApi.post(`/sessions/${sessionId}/message`, { message });
        return response.data;
    } catch (error: any) {
        context.error('Error sending message:', error);
        return { error: "Failed to send message", details: error.message };
    }
}

app.mcpTool('sendMessage', {
    toolName: 'sendMessage',
    description: 'Sends a message to an existing Devin session.',
    toolProperties: [
        {
            propertyName: 'sessionId',
            propertyType: 'string',
            description: 'The ID of the session to send the message to.',
        },
        {
            propertyName: 'message',
            propertyType: 'string',
            description: 'The message to send.',
        }
    ],
    handler: sendMessageHandler
});
