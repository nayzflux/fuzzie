import { generateState, GitHub, OAuth2RequestError } from "arctic";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { env } from "~/lib/env";
import { createAccount, getAccount } from "~/services/account";
import {
  createUserWithoutPassword,
  getUserWithPassword,
} from "~/services/user";
import { setSession } from "~/utils/session";

const STATE_COOKIE_NAME = "github_oauth_state";
const SCOPE = ["read:user", "user:email"];

const app = new Hono();

const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, {
  redirectURI: env.GITHUB_REDIRECT_URL,
});

app.get("/", async (c) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, { scopes: SCOPE });
  setCookie(c, STATE_COOKIE_NAME, state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Strict",
  });
  return c.redirect(url.toString());
});

app.get("/redirect", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const storedState = getCookie(c, STATE_COOKIE_NAME);

  if (!code || !state || !storedState || state !== storedState)
    throw new HTTPException(400);

  try {
    /**
     * Get access token
     */
    const tokens = await github.validateAuthorizationCode(code);

    /**
     * Get github user
     */
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUser = (await githubUserResponse.json()) as GitHubUser;

    // console.debug(githubUser);

    /**
     * Get email
     */
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const emails = (await emailsResponse.json()) as GitHubEmail[];

    // console.debug(emails);

    const email = emails.find((e) => e.primary === true && e.verified === true);

    // console.debug(email);

    if (!email) throw new HTTPException(400);

    /**
     * Account exists -> log in
     */
    const account = await getAccount(githubUser.id, "GITHUB");

    if (account) {
      await setSession(c, account.userId);
      return c.redirect(`${env.CLIENT_URL}/dashboard`);
    }

    /**
     * Account doesn't exists but User exists -> create Account -> log in
     */
    const user = await getUserWithPassword(email.email);

    if (user) {
      await createAccount(githubUser.id, "GITHUB", user.id);

      await setSession(c, user.id);
      return c.redirect(`${env.CLIENT_URL}/dashboard`);
    }

    /**
     * Account doesn't exists and User doesn't exists -> create User and Account -> log in
     */
    const createdUser = await createUserWithoutPassword(githubUser.id);
    await createAccount(githubUser.id, "GITHUB", createdUser.id);

    await setSession(c, createdUser.id);
    return c.redirect(`${env.CLIENT_URL}/dashboard`);
  } catch (e) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      throw new HTTPException(400);
    }

    throw new HTTPException(500);
  }
});

type GitHubUser = {
  id: string;
  login: string;
};

type GitHubEmail = {
  email: string;
  verified: boolean;
  primary: boolean;
  visibility: boolean;
};

export default app;
