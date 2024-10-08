import BasicSelect from "@/components/common/selects/basic-select";
import type { SelectItem } from "@/interfaces/select.interface";
import { useEffect, useState, type FunctionComponent } from "react";
import tz from "timezones-list";

interface Props {
  defaultTimezone: string;
  onChange: (timezone: string) => void;
}

const TimezoneSelect: FunctionComponent<Props> = ({
  defaultTimezone,
  onChange,
}) => {
  const [timezones, setTimezones] = useState<SelectItem[]>([]);

  useEffect(() => {
    setTimezones(tz.map(({ tzCode }) => ({ id: tzCode, title: tzCode })));
  }, []);

  return (
    <BasicSelect
      popperProps={{
        placement: "top",
        popperClassName: "h-[251px]",
      }}
      label=""
      options={timezones}
      fullWidth
      defaultValue={{
        id: defaultTimezone,
        title: defaultTimezone,
      }}
      onChange={(timezone) => onChange(timezone.title)}
    />
  );
};

export default TimezoneSelect;
