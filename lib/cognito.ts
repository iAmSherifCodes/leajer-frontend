import { Amplify } from 'aws-amplify'
import { signUp, signIn, confirmSignUp, resendSignUpCode, signOut, getCurrentUser } from 'aws-amplify/auth'

// Configure Amplify with your Cognito settings
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
      loginWith: {
        email: true,
      },
    },
  },
})

export const cognitoAuth = {
  signUp: async (email: string, password: string, name: string) => {
    return await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
        },
      },
    })
  },

  signIn: async (email: string, password: string) => {
    return await signIn({
      username: email,
      password,
    })
  },

  confirmSignUp: async (email: string, code: string) => {
    return await confirmSignUp({
      username: email,
      confirmationCode: code,
    })
  },

  resendCode: async (email: string) => {
    return await resendSignUpCode({
      username: email,
    })
  },

  signOut: async () => {
    return await signOut()
  },

  getCurrentUser: async () => {
    return await getCurrentUser()
  },
}