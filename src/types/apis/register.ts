export type PostRegisterResponse = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  nickname: string;
  newUser: boolean;
  requiresNicknameSetup: boolean;
};
