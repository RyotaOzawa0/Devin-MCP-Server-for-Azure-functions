variable "resource_group_name" {
  description = "The name of the resource group."
  type        = string
  default     = "rg-devin-mcp-functions"
}

variable "location" {
  description = "The Azure region where resources will be deployed."
  type        = string
  default     = "West US 2"
}

variable "storage_account_name" {
  description = "The name of the storage account. Must be globally unique."
  type        = string
  default     = "stdevinmcpfuncsa"
}

variable "app_service_plan_name" {
  description = "The name of the App Service Plan."
  type        = string
  default     = "plan-devin-mcp-func"
}

variable "function_app_name" {
  description = "The name of the Function App. Must be globally unique."
  type        = string
  default     = "func-devin-mcp-server"
}

variable "devin_api_key" {
  description = "The API key for the Devin service."
  type        = string
  sensitive   = true
  # This value should be set via a .tfvars file or environment variable
  # for security reasons, e.g., TF_VAR_devin_api_key="your_key"
}
