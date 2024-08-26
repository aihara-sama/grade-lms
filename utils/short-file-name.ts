export const shortenFileName = (fileName: string): string => {
  // Maximum allowed length
  const maxLength = 20;

  // Extract the file extension
  const extensionIndex = fileName.lastIndexOf(".");
  if (extensionIndex === -1) return fileName; // Return original if no extension is found

  const namePart = fileName.substring(0, extensionIndex);
  const extension = fileName.substring(extensionIndex);

  // Check if the entire file name is within the allowed length
  if (fileName.length <= maxLength) return fileName;

  // Determine how many characters we need to trim
  const remainingLength = maxLength - extension.length - 3; // 3 is for the "..."
  const firstPart = namePart.substring(0, remainingLength - 2); // Leave space for the last two characters
  const lastPart = namePart.substring(namePart.length - 2);

  return `${firstPart}...${lastPart}${extension}`;
};
