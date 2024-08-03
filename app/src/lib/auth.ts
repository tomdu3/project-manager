import { pb } from '@src/data/pocketbase'

export const isValidEmail = (email: string) => {
    if (typeof email !== 'string') return false
    if (email.length > 255) return false
    const regex = /^.+@.+$/
    return regex.test(email)
  }
  
  export const isValidPassword = (password: string) => {
    if (typeof password !== 'string') return false
    if (password.length > 255) return false
    if (password.length < 4) return false
    return true
  }
  
  export function isValidData(
    email: string,
    password: string
  ) {
    if (!isValidEmail(email)) {
      return false
    }
  
    if (!isValidPassword(password)) {
      return false
    }
  
    return true
  }

  export async function createUser(
    email: string,
    password: string
  ) {
    return await pb.collection('users').create({
      email: email,
      password: password,
      passwordConfirm: password,
      emailVisibility: true,
    })
  }