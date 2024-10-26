import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const ActivityIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 22}
      height={IconSize[size] || 19}
      className={className}
      viewBox="0 0 22 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.75 1.35714C2.75 0.606473 2.13555 0 1.375 0C0.614453 0 0 0.606473 0 1.35714V15.6071C0 17.4817 1.53828 19 3.4375 19H20.625C21.3855 19 22 18.3935 22 17.6429C22 16.8922 21.3855 16.2857 20.625 16.2857H3.4375C3.05937 16.2857 2.75 15.9804 2.75 15.6071V1.35714ZM20.2211 5.02991C20.7582 4.49978 20.7582 3.63884 20.2211 3.10871C19.684 2.57857 18.8117 2.57857 18.2746 3.10871L13.75 7.57879L11.2836 5.14442C10.7465 4.61429 9.87422 4.61429 9.33711 5.14442L4.52461 9.89442C3.9875 10.4246 3.9875 11.2855 4.52461 11.8156C5.06172 12.3458 5.93398 12.3458 6.47109 11.8156L10.3125 8.02835L12.7789 10.4627C13.316 10.9929 14.1883 10.9929 14.7254 10.4627L20.2254 5.03415L20.2211 5.02991Z"
        fill="#575757"
      />
    </svg>
  );
};

export default ActivityIcon;
