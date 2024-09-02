import Avatar from "@/components/avatar";
import type { getChatMessages } from "@/db/message";
import type { ResultOf } from "@/types";
import type { ChatFile } from "@/types/chat-files.type";
import { shortenFileName } from "@/utils/short-file-name";
import { db } from "@/utils/supabase/client";
import imgExtentions from "image-extensions";
import { useTranslations } from "next-intl";
import prettyBytes from "pretty-bytes";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  chatMessage: ResultOf<typeof getChatMessages>[number];
}

const Message: FunctionComponent<Props> = ({ chatMessage }) => {
  const t = useTranslations();

  const submitDownloadFile = async (file: ChatFile) => {
    try {
      const { data, error } = await db.storage
        .from("public")
        .download(`chat-files/${file.path}`);

      const a = document.createElement("a");
      const url = URL.createObjectURL(data);
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);

      if (error) throw new Error(t("failed_to_download_file"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex gap-2">
      <Avatar avatar={chatMessage.author_avatar} />
      <div className="rounded-[10px] p-2 w-full border border-gray-200 bg-neutral-50">
        <div className="text-sm font-bold text-neutral-600">
          {chatMessage.author}
        </div>
        <div className="text-sm text-neutral-500">{chatMessage.text}</div>
        {!!chatMessage.chat_files.length && (
          <div className="mt-1 interactive p-1 rounded-md">
            {chatMessage.chat_files.map((file) => (
              <div
                onClick={() => submitDownloadFile(file)}
                key={file.id}
                className="flex gap-2 cursor-pointer"
              >
                {imgExtentions.includes(file.ext) ? (
                  <img
                    alt=""
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/chat-files/${file.path}`}
                    className="rounded-md size-12"
                  />
                ) : (
                  <div className="bg-indigo-700 text-white font-bold size-12 rounded-md flex justify-center items-center">
                    {file.ext}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
