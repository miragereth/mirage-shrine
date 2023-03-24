import wordsJson from "./words.json"

export const bytes23ToString = (bytes23: string) => {
  const bytes = bytes23
    .substring(2)
    .split(/(.{2})/)
    .filter((s) => s.length === 2)
  const firstNullByteIndex = bytes.indexOf("00")
  // if someone makes a str with > 23 bytes, prevent crash
  const cutBytes =
    firstNullByteIndex === -1 ? bytes : bytes.slice(0, firstNullByteIndex)
  const uint8Array = cutBytes.map((byte) => Number.parseInt(byte, 16))
  const arrayBuffer = new Uint8Array(uint8Array)
  const utf8Decoder = new TextDecoder()
  return utf8Decoder.decode(arrayBuffer)
}

export const stringToBytes23 = (str: string) => {
  const utf8Encoder = new TextEncoder()
  const encoding = utf8Encoder.encode(str)
  const hexBytesArray = Array.from(encoding).map((e) => e.toString(16))
  if (hexBytesArray.length > 23) return null // doesn't fit.
  const padding = "00".repeat(23 - hexBytesArray.length)
  return "0x" + hexBytesArray.join("") + padding
}

export const randomRune = () => {
  const randomWord = wordsJson[Math.floor(Math.random() * wordsJson.length)]
  const bytes23 = stringToBytes23(
    `${randomWord[0].toUpperCase()}${randomWord.slice(1)}`
  ) as string
  return bytes23
}
