import { cognitoAuth } from './cognito'

export const verifyToken = async (email: string, code: string) => {
  return await cognitoAuth.confirmSignUp(email, code)
}

export const resendVerificationCode = async (email: string) => {
  return await cognitoAuth.resendCode(email)
}