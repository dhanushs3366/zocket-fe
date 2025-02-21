import { UserDetails } from "../api/dto"

export function getUserDetails(): UserDetails | null {
    if (typeof window !== 'undefined') {
      const userDetailsString = localStorage.getItem('userDetails')
      if (userDetailsString) {
        return JSON.parse(userDetailsString) as UserDetails
      }
    }
    return null
  }
  