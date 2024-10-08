"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useRef, useState, type FunctionComponent } from "react";

interface Props {
  date: Date;
}

const LiveTime: FunctionComponent<Props> = ({ date }) => {
  // State
  const [liveDate, setLiveDate] = useState<string>();

  // Refs
  const intervalIdRef = useRef<NodeJS.Timeout>();

  // Effects
  useEffect(() => {
    setLiveDate(formatDistanceToNowStrict(date));
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    intervalIdRef.current = setInterval(() => {
      setLiveDate(formatDistanceToNowStrict(date));
    }, 1000);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [date]);

  return liveDate;
};

export default LiveTime;
