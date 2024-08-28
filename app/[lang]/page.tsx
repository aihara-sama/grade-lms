"use client";

import { db } from "@/utils/supabase/client";
import type { NextPage } from "next";
import { useEffect } from "react";

const channel = db.channel("id", {
  config: {
    broadcast: {
      self: true,
    },
  },
});

const Page: NextPage = () => {
  const onClick = () => {
    channel.send({
      event: "check",
      type: "broadcast",
      payload: {
        check: true,
      },
    });
  };

  useEffect(() => {
    channel.on("broadcast", { event: "check" }, () => {
      console.log("broadcast");
    });
  }, []);

  return <button onClick={onClick}>Click</button>;
};

export default Page;
