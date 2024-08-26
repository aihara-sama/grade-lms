import BaseModal from "@/components/common/modals/base-modal";
import MessagesIcon from "@/components/icons/messages-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import { useUser } from "@/hooks/use-user";
import type { TablesInsert } from "@/types/supabase.type";
import { getFileExt } from "@/utils/get-file-ext";
import { shortenFileName } from "@/utils/short-file-name";
import { supabaseClient } from "@/utils/supabase/client";
import imgExtentions from "image-extensions";
import { useTranslations } from "next-intl";
import prettyBytes from "pretty-bytes";
import type {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
} from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDone: () => void;
  lessonId: string;
  file: File | undefined;
}

const CreateFileMessageModal: FunctionComponent<IProps> = ({
  lessonId,
  onDone,
  file,
  isOpen,
  setIsOpen,
}) => {
  const [chatMessage, setChatMessage] =
    useState<TablesInsert<"chat_messages">>();
  const [filePath, setFilePath] = useState("");
  const [fileExt, setFileExt] = useState("");

  const t = useTranslations();
  const { user } = useUser();

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatMessage((_) => ({ ..._, text: e.target.value }));
  };

  const submitUploadChatFile = async () => {
    try {
      const ext = await getFileExt(file);

      const { data, error } = await supabaseClient.storage
        .from("chat-files")
        .upload(`${uuid()}.${ext}`, file);

      setFileExt(ext);
      setFilePath(data.path);

      if (error) throw new Error(t("something_went_wrong"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitCreateMessage = async () => {
    try {
      const createdChatMessage = await supabaseClient
        .from("chat_messages")
        .insert(chatMessage)
        .select("id")
        .single();

      if (createdChatMessage.error) throw new Error(t("something_went_wrong"));

      const createdChatFile = await supabaseClient.from("chat_files").insert({
        ext: fileExt,
        name: file.name,
        size: file.size,
        message_id: createdChatMessage.data.id,
        path: filePath,
      });

      if (createdChatFile.error) throw new Error(t("something_went_wrong"));

      onDone();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOpen && file) submitUploadChatFile();
  }, [isOpen, file]);

  useEffect(() => {
    if (!isOpen)
      setChatMessage({
        author: user.name,
        author_avatar: user.avatar,
        author_role: user.role,
        lesson_id: lessonId,
        text: "",
      });
  }, []);

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Send File"
      isExpanded={false}
    >
      {filePath ? (
        <>
          <div className="flex gap-2 mb-2">
            {imgExtentions.includes(fileExt) ? (
              <img
                alt=""
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chat-files/${filePath}`}
                className="rounded-md size-12"
              />
            ) : (
              <div className="bg-indigo-700 text-white font-bold size-12 rounded-md flex justify-center items-center">
                {fileExt}
              </div>
            )}
            <div>
              <div className="text-neutral-600">
                {shortenFileName(file.name)}
              </div>
              <div className="text-sm text-neutral-500">
                {prettyBytes(file.size)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Input
              Icon={<MessagesIcon size="xs" />}
              value={chatMessage.text}
              onChange={onTextChange}
              fullWIdth
              className="w-full mb-auto"
            />
            <button className="primary-button" onClick={submitCreateMessage}>
              Send
            </button>
          </div>
        </>
      ) : (
        <Skeleton />
      )}
    </BaseModal>
  );
};

export default CreateFileMessageModal;
