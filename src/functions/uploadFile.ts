
import { app, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { devinApi } from '../lib/devin';
import { UploadFileResponse, ErrorResponse } from "../lib/types";

export async function uploadFileHandler(_message: unknown, context: InvocationContext): Promise<UploadFileResponse | ErrorResponse> {
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
        form.append('file', new Blob([Buffer.from(content)]), path);

        const result = await devinApi.post<UploadFileResponse>(`/sessions/upload?sessionId=${sessionId}`, form);

        return result;
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
