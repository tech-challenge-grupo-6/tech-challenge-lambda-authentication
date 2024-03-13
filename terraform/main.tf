provider "aws" {
  region = "us-west-1"
}

resource "aws_cognito_user_pool" "example" {
  name = "techchallenge-users"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "example" {
  name = "techchallenge-app"

  user_pool_id = aws_cognito_user_pool.example.id

  explicit_auth_flows = [
    "ADMIN_NO_SRP_AUTH",
    "CUSTOM_AUTH_FLOW_ONLY",
    "USER_PASSWORD_AUTH",
  ]

  allowed_oauth_flows_user_pool_client = true
  generate_secret                      = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
  callback_urls                        = ["https://www.example.com/callback"]
  logout_urls                          = ["https://www.example.com/logout"]
  default_redirect_uri                 = "https://www.example.com/redirect"
  supported_identity_providers         = ["COGNITO"]
}
