import { signIn, signOut } from 'next-auth/react';

export const AuthService = {
  loginWithCredentials: async (email: string, password: string) => {
    return await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
  },
  
  logout: async () => {
    return await signOut({ redirect: false });
  }
};
