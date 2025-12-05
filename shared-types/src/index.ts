// #region extension to host
export type ToNativeReverseMessage = {
  action: "reverse";
  text: string;
};

export type ToNativeMessage = ToNativeReverseMessage | never;
// #endregion

// #region host to extension
export type ToExtensionReverseSuccessResponse = {
  reversed: string;
};

export type ToExtensionErrorResponse = {
  error: string;
};

export type ToExtensionReverseResponse =
  | ToExtensionReverseSuccessResponse
  | ToExtensionErrorResponse;

export type ToExtensionResponse = ToExtensionReverseResponse;
// #endregion
