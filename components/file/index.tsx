"use client";

import { browserDB } from "@/lib/supabase/db/browser-db";
import { useEffect, useState, type FunctionComponent } from "react";

interface IProps {
  path: string;
  bucket: string;
}

const File: FunctionComponent<IProps> = ({ bucket, path }) => {
  const [blob, setBlob] = useState<Blob>();

  useEffect(() => {
    (async () => {
      const { data } = await browserDB.storage.from(bucket).download(path);

      setBlob(data);
    })();
  }, []);
  return (
    <img
      src={!!blob && URL.createObjectURL(blob)}
      alt=""
      className="size-12 rounded-[50%]"
    />
  );
};

export default File;
