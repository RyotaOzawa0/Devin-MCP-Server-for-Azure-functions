# Terraform Configuration for Devin MCP Azure Functions

This directory contains the Terraform configuration to deploy the Devin MCP server as an Azure Function App.

## Prerequisites

- [Terraform CLI](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- An active Azure subscription

## Deployment Steps

1.  **Authenticate with Azure:**

    Log in to your Azure account. Then, configure the necessary environment variables for Terraform to authenticate. Terraform will use these variables automatically.

    ```bash
    # Log in to Azure interactively
    az login

    # Get the current account details
    ACCOUNT_INFO=$(az account show)

    # Export the required environment variables
    export ARM_SUBSCRIPTION_ID=$(echo $ACCOUNT_INFO | jq -r .id)
    export ARM_TENANT_ID=$(echo $ACCOUNT_INFO | jq -r .tenantId)
    ```

    *Note: This command requires `jq` to be installed. If you don't have it, you can install it or manually copy the values from the `az account show` output.*

2.  **Initialize Terraform:**

    Navigate to this directory and run `terraform init` to download the necessary providers.

    ```bash
    cd terraform
    terraform init
    ```

3.  **Create a Terraform Variables File:**

    Create a file named `terraform.tfvars` and add your Devin API key. This file is not checked into source control.

    ```hcl
    # terraform.tfvars
    devin_api_key = "YOUR_DEVIN_API_KEY_HERE"
    ```

    Alternatively, you can set it as an environment variable:

    ```bash
    export TF_VAR_devin_api_key="YOUR_DEVIN_API_KEY_HERE"
    ```

4.  **Plan the Deployment:**

    Run `terraform plan` to see the resources that will be created.

    ```bash
    terraform plan
    ```

5.  **Apply the Configuration:**

    If the plan looks correct, apply the configuration to create the resources in Azure.

    ```bash
    terraform apply
    ```

    Terraform will prompt for confirmation before proceeding.

6.  **Deploy the Function Code:**

    After the infrastructure is created, you need to deploy your function app code. First, build the project, then deploy using the Azure Functions Core Tools.

    ```bash
    # From the project root directory
    npm install
    npm run build

    # Get the function app name from Terraform output
    FUNCTION_APP_NAME=$(terraform output -raw function_app_name)

    # Deploy the code
    func azure functionapp publish $FUNCTION_APP_NAME
    ```

## Cleanup

To destroy all the resources created by this configuration, run:

```bash
terraform destroy
```
