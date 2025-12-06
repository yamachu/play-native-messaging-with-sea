import type { ToExtensionResponse, ToNativeMessage } from "shared-types";

// https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/Native_messaging
function readMessage(): Promise<ToNativeMessage> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let messageLength: number | null = null;
    let receivedLength = 0;

    process.stdin.on("readable", () => {
      let chunk: Buffer | null;

      if (messageLength === null) {
        const lengthBuffer = process.stdin.read(4) as Buffer | null;
        if (lengthBuffer === null) return;
        messageLength = lengthBuffer.readUInt32LE(0);
      }

      while ((chunk = process.stdin.read() as Buffer | null) !== null) {
        chunks.push(chunk);
        receivedLength += chunk.length;

        if (receivedLength >= messageLength) {
          const messageBuffer = Buffer.concat(chunks).slice(0, messageLength);
          const messageText = messageBuffer.toString("utf-8");
          try {
            const message = JSON.parse(messageText) as ToNativeMessage;
            resolve(message);
          } catch (e) {
            reject(new Error("Failed to parse message"));
          }
          break;
        }
      }
    });

    process.stdin.on("error", reject);
  });
}

function writeMessage(response: ToExtensionResponse): void {
  const messageText = JSON.stringify(response);
  const messageBuffer = Buffer.from(messageText, "utf-8");
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(messageBuffer.length, 0);

  process.stdout.write(lengthBuffer);
  process.stdout.write(messageBuffer);
}

function reverseString(str: string): string {
  return str.split("").reverse().join("");
}

async function main(): Promise<void> {
  try {
    const message = await readMessage();

    if (message.action === "reverse") {
      const reversed = reverseString(message.text);
      // TODO: 1MB以内かどうかチェック、長かった場合は分割して送れるようにメッセージ型を変えたいけれども………
      writeMessage({ reversed });
    } else {
      writeMessage({ error: "Invalid action or missing text" });
    }
  } catch (error) {
    writeMessage({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

main();
