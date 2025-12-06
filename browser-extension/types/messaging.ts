// #region: frontend to background
type MessageType<T extends string, P> = {
  type: T;
  payload: P;
};

export type ReverseStringMessage = MessageType<
  "REVERSE_STRING",
  { text: string }
>;

export type ExtensionMessage = ReverseStringMessage | never;
// #endregion

// #region: background to frontend
export interface ReverseStringSuccessResponse {
  success: true;
  reversed: string;
}

export interface ReverseStringErrorResponse {
  success: false;
  error: string;
}

export type ReverseStringResponse =
  | ReverseStringSuccessResponse
  | ReverseStringErrorResponse;
// #endregion

export interface MessageResponseMap {
  REVERSE_STRING: ReverseStringResponse;
}

export async function sendTypedMessage<T extends ExtensionMessage>(
  message: T
): Promise<MessageResponseMap[T["type"]]> {
  return browser.runtime.sendMessage(message);
}
