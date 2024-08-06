"use client";

import { formatTimeUntilEvent } from "@/helpers/format-time-until-event";
import { useEffect, useState, type FunctionComponent } from "react";

interface IProps {
  date: Date;
}

const LiveTime: FunctionComponent<IProps> = ({ date }) => {
  const [liveDate, setLiveDate] = useState(formatTimeUntilEvent(date));

  useEffect(() => {
    setInterval(() => {
      setLiveDate(formatTimeUntilEvent(date));
    }, 1000);
  }, []);

  return liveDate;
};

export default LiveTime;
