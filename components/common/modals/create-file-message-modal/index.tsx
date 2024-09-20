import BaseModal from "@/components/common/modals/base-modal";
import File from "@/components/file";
import MessagesIcon from "@/components/icons/messages-icon";
import Input from "@/components/input";
import Skeleton from "@/components/skeleton";
import { MAX_CHAT_FILE_SIZE } from "@/constants";
import { uploadChatFile } from "@/db/message";
import { Event } from "@/enums/event.enum";
import { useChatChannel } from "@/hooks/use-chat-channel";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import type { ChatMessageWithFiles } from "@/types/chat-message";
import type { TablesInsert } from "@/types/supabase.type";
import { getFileExt } from "@/utils/file/get-file-ext";
import { shortenFileName } from "@/utils/file/shorten-file-name";
import clsx from "clsx";
import imgExtentions from "image-extensions";
import { useTranslations } from "next-intl";
import prettyBytes from "pretty-bytes";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import videoExtensions from "video-extensions";

interface Props {
  onClose: (mutated?: boolean) => void;
  lessonId: string;
  courseId?: string;
  file: File | undefined;
}

const CreateFileMessageModal: FunctionComponent<Props> = ({
  lessonId,
  courseId,
  file,
  onClose,
}) => {
  // Hooks
  const t = useTranslations();
  const { user } = useUser();
  const [isSubmittingCreateMessage, setIsSubmittingCreateMessage] =
    useState(false);
  const channel = useChatChannel();

  // State
  const [chatMessage, setChatMessage] = useState<TablesInsert<"chat_messages">>(
    {
      lesson_id: lessonId,
      creator_id: user.id,
      text: "",
    }
  );
  const [filePath, setFilePath] = useState("");
  const [fileExt, setFileExt] = useState("");

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatMessage((_) => ({ ..._, text: e.target.value }));
  };

  const fireChatMessageCreate = (message: ChatMessageWithFiles) => {
    channel.send({
      event: Event.ChatMessageCreated,
      type: "broadcast",
      payload: message,
    });
  };

  const submitUploadChatFile = async () => {
    try {
      const ext = await getFileExt(file);

      if (videoExtensions.includes(ext))
        throw new Error(t("video_format_is_not_allowed"));

      if (file.size >= MAX_CHAT_FILE_SIZE)
        throw new Error(t("file_size_too_big"));

      const { path } = await uploadChatFile(courseId || uuid(), file, ext);
      console.log({ path });

      setFileExt(ext);
      setFilePath(path);
    } catch (error: any) {
      toast.error(error.message);
      onClose();
    }
  };

  const submitCreateMessage = async () => {
    setIsSubmittingCreateMessage(true);
    try {
      const createdChatMessage = await DB.from("chat_messages")
        .insert(chatMessage)
        .select("*, chat_files(*), author:users(*)")
        .single();

      if (createdChatMessage.error) throw new Error(t("something_went_wrong"));

      const createdChatFile = await DB.from("chat_files")
        .insert({
          ext: fileExt,
          name: file.name,
          size: file.size,
          message_id: createdChatMessage.data.id,
          path: filePath,
        })
        .select("*")
        .single();

      if (createdChatFile.error) throw new Error(t("something_went_wrong"));

      fireChatMessageCreate({
        ...createdChatMessage.data,
        chat_files: [createdChatFile.data],
      });
      onClose(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingCreateMessage(false);
    }
  };

  useEffect(() => {
    if (file) submitUploadChatFile();
  }, [file]);

  return (
    <BaseModal onClose={() => onClose()} title="Send File" isExpanded={false}>
      {filePath ? (
        <>
          <div className="flex gap-2 mb-2">
            {imgExtentions.includes(fileExt) ? (
              <File bucket="courses" path={filePath} />
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
              startIcon={<MessagesIcon size="xs" />}
              value={chatMessage.text}
              onChange={onTextChange}
              fullWidth
              className="w-full mb-auto"
            />
            <button className="primary-button" onClick={submitCreateMessage}>
              {isSubmittingCreateMessage && (
                <img
                  className="loading-spinner"
                  src="/gifs/loading-spinner.gif"
                  alt=""
                />
              )}
              <span
                className={`${clsx(isSubmittingCreateMessage && "opacity-0")}`}
              >
                Send
              </span>
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
