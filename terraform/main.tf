terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_cognito_user_pool" "meu_user_pool" {
  name = "techchallenge-users"

  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  username_attributes = ["email"]
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 6
      max_length = 255
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = false
    name                     = "nome"
    required                 = false

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = false
    name                     = "cpf"
    required                 = false # Alterado para false

    string_attribute_constraints {
      min_length = 11
      max_length = 11
    }
  }

  email_verification_message = "Seu código de verificação é {####}."
  email_verification_subject = "Seu código de verificação"
}

resource "aws_cognito_user_pool_client" "meu_app_client" {
  name                                 = "techchallenge-app"
  user_pool_id                         = aws_cognito_user_pool.meu_user_pool.id
  generate_secret                      = false
  explicit_auth_flows                  = ["ALLOW_ADMIN_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = ["https://www.exemplo.com/callback"]
  logout_urls                          = ["https://www.exemplo.com/logout"]
}
