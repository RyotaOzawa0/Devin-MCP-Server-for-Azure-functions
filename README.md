
# Devin MCP Server for Azure Functions

This project provides a remote MCP (Model Context Protocol) server for interacting with the Devin API. It is built with TypeScript and designed to be deployed as an Azure Function App.

This server exposes the Devin API functionality as custom tools that can be invoked by compatible clients like GitHub Copilot.

## Features

The following tools are implemented:

*   `createSession`: Creates a new Devin session.
*   `sendMessage`: Sends a message to an existing Devin session.
*   `uploadFile`: Uploads a file to a Devin session.
*   `listSessions`: Retrieves a list of all sessions.
*   `getSession`: Gets the details of a specific session.
*   `updateTags`: Updates the tags for a specific session.

## Prerequisites

*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools)
*   [Devin API Key](https://app.devin.ai/settings/api-keys)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devin-mcp.git
cd devin-mcp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

The server requires your Devin API key to be configured as an environment variable. For local development, you can use the `local.settings.json` file.

Open `local.settings.json` and replace `YOUR_DEVIN_API_KEY_HERE` with your actual Devin API key.

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DEVIN_API_KEY": "YOUR_DEVIN_API_KEY_HERE",
    "AzureWebJobsSecretStorageType": "Files"
  }
}
```

## Running Locally

To start the function app locally, run the following command:

```bash
npm start
```

The MCP server will be available at `http://localhost:7071`. You can then connect your MCP client to this endpoint.

## Connecting from a Client

You can connect to this MCP server from any compatible client, such as the [MCP Inspector](https://www.npmjs.com/package/@modelcontextprotocol/inspector) or GitHub Copilot.

### Connecting to a Local Server

When running the server locally, use the following SSE endpoint URL:

`http://localhost:7071/runtime/webhooks/mcp/sse`

No authentication is required for local connections.

For clients that support a configuration file (e.g., a `.mcp.json` file), you can define the server connection like this:

```json
{
    "servers": {
        "DevinMCP": {
            "type": "sse",
            "url": "http://localhost:7071/runtime/webhooks/mcp/sse"
        }
    }
}
```

### Connecting to a Remote Server (Azure)

Once deployed to Azure, the server requires authentication using a system key. You can get this key from the Terraform output or from the Azure Portal (`Function App -> App Keys -> System Keys -> mcp_extension`).

For clients that support a configuration file (e.g., a `.mcp.json` file), you can define the remote server connection like this. Replace the URL with your function app's hostname and the key with your `mcp_extension` system key.

```json
{
    "servers": {
        "Devin-MCP-Azure-Functions": {
            "type": "sse",
            "url": "https://<your-function-app-name>.azurewebsites.net/runtime/webhooks/mcp/sse",
            "headers": {
                "x-functions-key": "YOUR_MCP_EXTENSION_SYSTEM_KEY"
            }
        }
    }
}
```

> **Note on Authentication:** This sample uses Azure Functions' built-in API key (system key) authentication for simplicity and ease of deployment. The formal MCP specification mentions compliance with the [OAuth 2.0 Dynamic Client Registration Protocol](https://www.rfc-editor.org/rfc/rfc7591) for more robust security. A production-grade implementation might require a more complex setup involving an identity provider to fully adhere to this standard.

## Deployment

This Function App is ready to be deployed to Azure. You can use the [Azure Developer CLI (`azd`)](https://aka.ms/azd) or standard Azure Functions deployment methods.

### Deploying with Terraform

For automated infrastructure as code deployment, you can use the provided Terraform configuration.

Detailed instructions can be found in the [Terraform README](./terraform/README.md).

## References

*   **Azure Functions Remote MCP Server Sample:** [Azure-Samples/remote-mcp-functions-typescript](https://github.com/Azure-Samples/remote-mcp-functions-typescript/tree/main)
*   **Azure Functions MCP Trigger Bindings:** [Azure Functions MCP Trigger Documentation](https://docs.azure.cn/en-us/azure-functions/functions-bindings-mcp-trigger?tabs=attribute&pivots=programming-language-typescript)
*   **Devin API Reference:** [Devin API Documentation](https://docs.devin.ai/api-reference/overview)
