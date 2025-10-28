import { Amplify } from 'aws-amplify'
import { signUp, signIn, confirmSignUp, resendSignUpCode, signOut, getCurrentUser, fetchAuthSession, AuthTokens} from 'aws-amplify/auth'
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand, AdminListGroupsForUserCommand } from '@aws-sdk/client-cognito-identity-provider'

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

  signUpSalesperson: async (email: string, password: string, name: string) => {
    // Store role in localStorage for later use during confirmation
    localStorage.setItem(`signup_role_${email}`, 'salesperson')
    return await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
          'custom:role': 'salesperson',
        },
      },
    })
  },

  signUpOwner: async (email: string, password: string, name: string) => {
    // Store role in localStorage for later use during confirmation
    localStorage.setItem(`signup_role_${email}`, 'owner')
    return await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
          'custom:role': 'owner',
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
      
      // Add user to appropriate group after confirmation
      const storedRole = localStorage.getItem(`signup_role_${email}`)
      await cognitoAuth.addUserToGroup(email, storedRole || undefined)
      // Clean up stored role
      localStorage.removeItem(`signup_role_${email}`)
      
      return result
    } catch (error) {
      console.error('Cognito confirmSignUp error:', error)
      throw error
    }
  },

  addUserToGroup: async (username: string, role?: string) => {
    try {
      const client = new CognitoIdentityProviderClient({
        region: process.env.NEXT_PUBLIC_AWS_REGION
        // credentials: {
        //   accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        //   secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        // },
      })

      // Determine group based on role or username pattern
      let groupName = role == "salesperson" ? "SalespersonGroup" : "OwnerGroup"; 

      const command = new AdminAddUserToGroupCommand({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        Username: username,
        GroupName: groupName,
      })

      await client.send(command)
      console.log(`User ${username} added to group ${groupName}`)
    } catch (error) {
      console.error('Failed to add user to group:', error)
      // Don't throw error to avoid breaking the confirmation flow
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

  getCurrentSession: async () => {
    return await fetchAuthSession()
  },

  getUserRole: async (username: string): Promise<'owner' | 'salesperson'> => {
    try {
      const client = new CognitoIdentityProviderClient({
        region: process.env.NEXT_PUBLIC_AWS_REGION
        // credentials: {
        //   accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        //   secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        // },
      })

      const command = new AdminListGroupsForUserCommand({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        Username: username,
      })

      const result = await client.send(command)
      const groups = result.Groups || []
      
      // Check if user is in owner group
      if (groups.some(group => group.GroupName === 'OwnerGroup')) {
        return 'owner'
      }
      
      return 'salesperson' // default
    } catch (error) {
      console.error('Failed to get user role:', error)
      return 'salesperson' // default fallback
    }
  }
}