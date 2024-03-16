# Lambda-authentication-function

Projeto serverless Lambda responsável por autenticação do tech challenge utilizando aws cognito

## Quick start

### Rodando local

`npm run start`

### Deployando

`npm run deploy --stage %{ENVIRONMENT}`

Obs: Environment pode ser dev, hml ou prd

## Rotas

Cadastro

`/user/signup`

Body:

```
{
    "email": "string",
    "cpf": "string",
    "name": "string"
}
```

Login

`/user/login`

Body:

```
{
    "email": "string",
    "cpf": "string"
}
```

Testar autenticação

`/user/private`

## Stack

- [Serverless framework](https://www.serverless.com/)
- [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [AWS Lambda](https://aws.amazon.com/pt/lambda/)
- [AWS Cognito](https://aws.amazon.com/pt/pm/cognito/)
