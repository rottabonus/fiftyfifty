import { User } from "../routes/user/models.js";

export const getUserInfo = async (accessToken: string) => {
  const userInfoUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;
  const userInfo = await fetch(userInfoUrl);
  const userJson = await userInfo.json();
  const userParsed = User.safeParse(userJson);
  return userParsed;
};
