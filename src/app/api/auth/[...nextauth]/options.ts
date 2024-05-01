import type { NextAuthOptions } from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import CredentialProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialProvider({
        name: "Credentials",
        credentials: {
            username: {
                label: "Username:",
                type: "text",
                placeholder: "Your username"
            },
            password: {
                label : "Password:",
                type : "password",
                placeholder: "Your password"
            },
        },
        async authorize(credentials) {
            const user = { id: "42", name: "Dave", password: "nextauth"}

            if (credentials?.username === user.name && credentials?.password === user.password) {
                return user
            } else {
                return null
            }

        }
    })
    // ...add more providers here
  ],
}

