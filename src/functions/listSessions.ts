import { app, InvocationContext } from "@azure/functions";
import { devinApi } from '../lib/devin';

export async function listSessionsHandler(_message: unknown, context: InvocationContext): Promise<any> {
    context.log('Listing all Devin sessions...');

    try {
        const response = await devinApi.get('/sessions');
        return response.data;
    } catch (error: any) {
        context.error('Error listing sessions:', error);
        return { error: "Failed to list sessions", details: error.message };
    }
}

app.mcpTool('listSessions', {
    toolName: 'listSessions',
    description: 'Retrieves a list of all Devin sessions.',
    handler: listSessionsHandler
});