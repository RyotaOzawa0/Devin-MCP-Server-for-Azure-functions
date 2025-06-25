output "function_app_hostname" {
  description = "The hostname of the deployed Function App."
  value       = azurerm_linux_function_app.func.default_hostname
}

output "function_app_mcp_sse_url" {
  description = "The SSE endpoint URL for the MCP server."
  value       = "https://${azurerm_linux_function_app.func.default_hostname}/runtime/webhooks/mcp/sse"
}
