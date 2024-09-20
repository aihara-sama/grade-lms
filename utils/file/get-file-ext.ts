import fileExtension from "file-extension";
import { fileTypeFromBlob } from "file-type";

export const getFileExt = async (file: File) => {
  const fromBlob = await fileTypeFromBlob(file);
  if (fromBlob) return fromBlob.ext;

  const fromFileName = fileExtension(file.name);
  if (fromFileName !== file.name) return fromFileName;

  return "file";
};
