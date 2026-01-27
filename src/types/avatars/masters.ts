export interface AvatarType {
  id: number;
  defaultImageUrl: string;
  description: string;
}

export interface SelectAvatarResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AvatarType[];
}

export interface CreateAvatarResponse {
  imageUrl: string;
}

export interface FinalChoiceAvatarRequest {
  nickname: string;
  imageUrl: string;
  masterId: number;
}

export interface FinalChoiceAvatarResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}
