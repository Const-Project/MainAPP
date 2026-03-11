export type RegistrationMode = "selection" | "creation";

export interface AvatarMaster {
  id: number;
  defaultImageUrl: string;
  description: string;
}

export interface SelectAvatarResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AvatarMaster[];
}

export interface UploadCreationAvatarResponse {
  imageUrl: string;
}

export interface FinalChoiceAvatarRequest {
  nickname: string;
  imageUrl: string;
  masterId: number | null;
}

export interface FinalChoiceAvatarResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

export interface RegistrationCreationDetail {
  imageUri: string;
  uploadedImageUrl: string;
}

export interface RegistrationAvatarPreview {
  masterId: number | null;
  description: string;
  imageUrl: string | null;
}
