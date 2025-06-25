import { app, InvocationContext } from "@azure/functions";
import { devinApi } from '../lib/devin';
import { Session, ErrorResponse } from "../lib/types";

export async function listSessionsHandler(_message: unknown, context: InvocationContext): Promise<Session[] | ErrorResponse> {
    context.log('Listing all Devin sessions...');

    try {
        const sessions = await devinApi.get<Session[]>('/sessions');
        return sessions;
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