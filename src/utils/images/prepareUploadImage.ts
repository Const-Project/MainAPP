import { File } from "expo-file-system";
import type { ImagePickerAsset } from "expo-image-picker";
import type { Action } from "expo-image-manipulator";

type PreparedUploadImage = {
  uri: string;
  fileName: string;
  mimeType: "image/jpeg";
};

const MAX_UPLOAD_BYTES = 9.5 * 1024 * 1024;
const DIMENSION_STEPS = [1600, 1280, 1024, 768];
const QUALITY_STEPS = [0.72, 0.6, 0.48, 0.36, 0.28];

const makeJpegName = (prefix: string) => `${prefix}-${Date.now()}.jpg`;

const getFileSize = (uri: string) => new File(uri).size;

const getResizeAction = (
  asset: ImagePickerAsset,
  maxDimension: number
): Action[] => {
  const width = asset.width ?? 0;
  const height = asset.height ?? 0;
  const longestSide = Math.max(width, height);

  if (!longestSide || longestSide <= maxDimension) {
    return [];
  }

  return width >= height
    ? [{ resize: { width: maxDimension } }]
    : [{ resize: { height: maxDimension } }];
};

export const prepareUploadImage = async (
  asset: ImagePickerAsset,
  fileNamePrefix: string
): Promise<PreparedUploadImage> => {
  let fallbackUri = asset.uri;
  let ImageManipulator: typeof import("expo-image-manipulator") | null = null;

  try {
    ImageManipulator = require("expo-image-manipulator");
  } catch {
    ImageManipulator = null;
  }

  if (!ImageManipulator) {
    return {
      uri: asset.uri,
      fileName: makeJpegName(fileNamePrefix),
      mimeType: "image/jpeg",
    };
  }
  const manipulator = ImageManipulator;

  for (const maxDimension of DIMENSION_STEPS) {
    const resizeAction = getResizeAction(asset, maxDimension);

    for (const quality of QUALITY_STEPS) {
      const result = await manipulator.manipulateAsync(asset.uri, resizeAction, {
        compress: quality,
        format: manipulator.SaveFormat.JPEG,
      });
      fallbackUri = result.uri;

      if (getFileSize(result.uri) <= MAX_UPLOAD_BYTES) {
        return {
          uri: result.uri,
          fileName: makeJpegName(fileNamePrefix),
          mimeType: "image/jpeg",
        };
      }
    }
  }

  return {
    uri: fallbackUri,
    fileName: makeJpegName(fileNamePrefix),
    mimeType: "image/jpeg",
  };
};
