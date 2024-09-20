import { GoogleUser } from "../routes/googleUser/models.js";

export const getGoogleUserInfo = async (accessToken: string) => {
  const userInfoUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;
  const userInfo = await fetch(userInfoUrl);
  const userJson = await userInfo.json();
  const userParsed = GoogleUser.safeParse(userJson);
  return userParsed;
};
