
import { app, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { devinApi } from '../lib/devin';
import FormData from 'form-data';

export async function uploadFileHandler(_message: unknown, context: InvocationContext): Promise<any> {
    context.log('Uploading a file to a Devin session...');

    const toolArgs = context.triggerMetadata.mcptoolargs as { sessionId?: string, path?: string, content?: string };

    const schema = z.object({
        sessionId: z.string().min(1),
        path: z.string().min(1),
        content: z.string().min(1),
    });
    const validationResult = schema.safeParse(toolArgs);

    if (!validationResult.success) {
        context.error("Validation failed", validationResult.error);
        return { error: "Invalid arguments", issues: validationResult.error.issues };
    }

    const { sessionId, path, content } = validationResult.data;

    try {
        const form = new FormData();
        form.append('file', Buffer.from(content), {
            filename: path,
        });

        const response = await devinApi.post(`/sessions/upload?sessionId=${sessionId}`, form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        return response.data;
    } catch (error: any) {
        context.error('Error uploading file:', error);
        return { error: "Failed to upload file", details: error.message };
    }
}

app.mcpTool('uploadFile', {
    toolName: 'uploadFile',
    description: 'Uploads a file to a Devin session.',
    toolProperties: [
        {
            propertyName: 'sessionId',
            propertyType: 'string',
            description: 'The ID of the session to upload the file to.',
        },
        {
            propertyName: 'path',
            propertyType: 'string',
            description: 'The path where the file will be saved in the session.',
        },
        {
            propertyName: 'content',
            propertyType: 'string',
            description: 'The content of the file to upload.',
        }
    ],
    handler: uploadFileHandler
});
