import { ApiError } from "../utils/ApiError";

// pdf-parse's main entry runs debug code in some setups, so import the lib file directly
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const parsed = await pdfParse(buffer);
    return (parsed.text as string).trim();
  } catch {
    throw new ApiError(400, "Could not read this PDF. Try another file or paste the text.");
  }
}
