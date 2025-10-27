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
    try {
      console.log('Confirming signup for:', email, 'with code:', code)
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code,
      })
      console.log('Confirmation result:', result)
      return result
    } catch (error) {
      console.error('Cognito confirmSignUp error:', error)
      throw error
    }
  },

  resendCode: async (email: string) => {
    try {
      console.log('Resending code for:', email)
      const result = await resendSignUpCode({
        username: email,
      })
      console.log('Resend result:', result)
      return result
    } catch (error) {
      console.error('Cognito resendCode error:', error)
      throw error
    }
  },

  signOut: async () => {
    return await signOut()
  },

  getCurrentUser: async () => {
    return await getCurrentUser()
  },
}