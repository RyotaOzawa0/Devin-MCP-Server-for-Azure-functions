
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
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DEVIN_API_KEY": "YOUR_DEVIN_API_KEY_HERE"
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

Once deployed to Azure, the server requires authentication using a system key.

1.  **Get the Function App URL:** The URL will be in the format `https://<your-function-app-name>.azurewebsites.net/runtime/webhooks/mcp/sse`.

2.  **Get the System Key:** You need to obtain the `mcp_extension` system key for your Function App. You can find this in the Azure Portal (under `App Keys` in your Function App) or by using the Azure CLI:

    ```bash
    az functionapp keys list --resource-group <resource-group-name> --name <your-function-app-name> --query "systemKeys.mcp_extension" -o tsv
    ```

3.  **Configure the Client:**

    *   **URL:** `https://<your-function-app-name>.azurewebsites.net/runtime/webhooks/mcp/sse`
    *   **Header:** Add a header with the key `x-functions-key` and the value of your `mcp_extension` system key.

    If your client supports it, you can also include the key as a query parameter: `?code=<your-mcp_extension-key>`

## Deployment

This Function App is ready to be deployed to Azure. You can use the [Azure Developer CLI (`azd`)](https://aka.ms/azd) or standard Azure Functions deployment methods.

### Deploying with Terraform

For automated infrastructure as code deployment, you can use the provided Terraform configuration.

Detailed instructions can be found in the [Terraform README](./terraform/README.md).

## References

*   **Azure Functions Remote MCP Server Sample:** [Azure-Samples/remote-mcp-functions-typescript](https://github.com/Azure-Samples/remote-mcp-functions-typescript/tree/main)
*   **Azure Functions MCP Trigger Bindings:** [Azure Functions MCP Trigger Documentation](https://docs.azure.cn/en-us/azure-functions/functions-bindings-mcp-trigger?tabs=attribute&pivots=programming-language-typescript)
*   **Devin API Reference:** [Devin API Documentation](https://docs.devin.ai/api-reference/overview)
