export interface ChangeNicknameRequest {
  newNickname: string;
}

export interface ChangeNicknameResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

export interface DeleteAccountResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}
