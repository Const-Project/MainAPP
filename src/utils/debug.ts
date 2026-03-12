export function debugLog(scope: string, message: string, payload?: unknown) {
  if (payload === undefined) {
    console.debug(`[Debug][${scope}] ${message}`);
    return;
  }

  console.debug(`[Debug][${scope}] ${message}`, payload);
}

export function debugScreenMounted(screenName: string, payload?: unknown) {
  debugLog("Screen", `${screenName} mounted`, payload);
}
