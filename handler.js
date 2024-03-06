"use strict";
const AWS = require('aws-sdk')

const cognito = new AWS.CognitoIdentityServiceProvider()

module.exports.signup = async (event) => {
  try {
    const { cpf, email, name } = JSON.parse(event.body)
    const cpfValido = validarCPF(cpf)
    if (!cpfValido) {
      return {
        statusCode: 400,
        body: JSON.stringify(
        {
          message: "CPF inválido",
        }),
      };
    }

    const { user_pool_id } = process.env
      
    const params = {
      UserPoolId: "us-east-1_lnmvkmOPF",
      Username: email,
      UserAttributes: [{
        Name: 'email',
        Value: email
      },{
        Name: 'custom:name',
        Value: name
      },{
        Name: 'custom:cpf',
        Value: cpf
      },{
        Name: 'email_verified',
        Value: 'true'
      }],
      MessageAction: 'SUPPRESS'
    }
    const response = await cognito.adminCreateUser(params).promise();
    const password = "123456#Tech"

    if (response.User) {
      const paramsForSetPass = {
        Password: password,
        UserPoolId: user_pool_id,
        Username: email,
        Permanent: true
      };
      await cognito.adminSetUserPassword(paramsForSetPass).promise()
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
      {
        error: error.message,
      }),
    }
  }
}

module.exports.login = async (event) => {
  try {
    const { email, cpf } = JSON.parse(event.body)

    const cpfValido = validarCPF(cpf)
    if (!cpfValido) {
      return {
        statusCode: 400,
        body: JSON.stringify(
        {
          message: "CPF inválido",
        }),
      };
    }
    
    const { user_pool_id, client_id } = process.env

    const password = "123456#Tech"
    
    const params = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      UserPoolId: user_pool_id,
      ClientId: client_id,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }
    const response = await cognito.adminInitiateAuth(params).promise()
    const user = await cognito.getUser({AccessToken: response.AuthenticationResult.AccessToken}).promise()

    const cpfIgual = verificarCPFequal(user.UserAttributes, cpf)

    if (cpfIgual) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Success',
          token: response.AuthenticationResult.IdToken
        })
      }
    } else {
      await cognito.globalSignOut({AccessToken: response.AuthenticationResult.AccessToken}).promise()
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'Unauthorized'
        })
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
      {
        error: error.message,
      }),
    };
  }
};

module.exports.private = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `User cpf ${event.requestContext.authorizer.claims['custom:cpf']} has been authorized`
    }),
  }
}

function verificarCPFequal(obj, value) {
  for (let i = 0; i < obj.length; i++) {
      if (obj[i].Name === 'custom:cpf' && obj[i].Value === value) {
          return true
      }
  }
  return false
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11) {
      return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
  }

  var soma = 0;
  for (var i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  var resto = 11 - (soma % 11);
  var dv1 = resto === 10 || resto === 11 ? 0 : resto;

  if (dv1 !== parseInt(cpf.charAt(9))) {
      return false;
  }

  soma = 0;
  for (var i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  var dv2 = resto === 10 || resto === 11 ? 0 : resto;

  if (dv2 !== parseInt(cpf.charAt(10))) {
      return false;
  }

  return true;
}