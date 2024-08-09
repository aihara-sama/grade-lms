"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState, type FunctionComponent } from "react";

interface IProps {
  date: Date;
}

const LiveTime: FunctionComponent<IProps> = ({ date }) => {
  const [liveDate, setLiveDate] = useState(formatDistanceToNowStrict(date));

  useEffect(() => {
    setInterval(() => {
      setLiveDate(formatDistanceToNowStrict(date));
    }, 1000);
  }, []);

  return liveDate;
};

export default LiveTime;
