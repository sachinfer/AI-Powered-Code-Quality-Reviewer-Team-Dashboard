import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

console.log("GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID);
console.log("GITHUB_CLIENT_SECRET", process.env.GITHUB_CLIENT_SECRET);

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST }; 