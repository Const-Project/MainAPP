import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAvatarMastersApi,
  postFinalChoiceAvatarApi,
  postUploadCreationAvatarApi,
} from "@/apis/avatars/avatarApi";
import type {
  AvatarMaster,
  FinalChoiceAvatarRequest,
  FinalChoiceAvatarResponse,
  SelectAvatarResponse,
  UploadCreationAvatarResponse,
} from "@/types/avatars";

export const useAvatarMasters = () =>
  useQuery<SelectAvatarResponse, Error, AvatarMaster[]>({
    queryKey: ["avatar-masters"],
    queryFn: getAvatarMastersApi,
    select: data => data.result,
    refetchOnMount: "always",
    staleTime: 0,
  });

export const useUploadCreationAvatar = () =>
  useMutation<UploadCreationAvatarResponse, Error, FormData>({
    mutationFn: formData => postUploadCreationAvatarApi(formData),
  });

export const useFinalChoiceAvatar = () =>
  useMutation<FinalChoiceAvatarResponse, Error, FinalChoiceAvatarRequest>({
    mutationFn: payload => postFinalChoiceAvatarApi(payload),
  });
