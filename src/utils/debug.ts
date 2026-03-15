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

export function createTimingLogger(scope: string, eventName: string, payload?: unknown) {
  const startedAt = Date.now();
  debugLog(scope, `${eventName} started`, payload);

  return (extra?: Record<string, unknown>) => {
    debugLog(scope, `${eventName} finished`, {
      durationMs: Date.now() - startedAt,
      ...(extra ?? {}),
    });
  };
}
