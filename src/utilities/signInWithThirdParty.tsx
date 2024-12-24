import { signIn } from "next-auth/react";

const signInWithThirdParty = async (
  provider: string,
  callbackUrl: string,
  redirect: boolean = true
) => {
  const response = await signIn(provider, { callbackUrl, redirect });
  return response;
};

export default signInWithThirdParty;
