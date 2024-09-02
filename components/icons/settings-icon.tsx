import type { FunctionComponent } from "react";

interface Props {
  className?: string;
}

const SettingsIcon: FunctionComponent<Props> = ({ className }) => {
  return (
    <svg
      width="14"
      height="14"
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.95 0L5.39127 0.415715L4.92142 1.98187L3.48173 1.20665L2.79269 1.30778L1.30776 2.7927L1.20664 3.48174L1.98186 4.92143L0.415715 5.39127L0 5.95V8.05L0.415715 8.60876L1.98186 9.07861L1.20666 10.5183L1.30779 11.2073L2.79271 12.6922L3.48175 12.7934L4.92142 12.0181L5.39127 13.5843L5.95 14H8.05L8.60876 13.5843L9.07861 12.0181L10.5183 12.7934L11.2073 12.6922L12.6922 11.2073L12.7934 10.5183L12.0181 9.07853L13.5843 8.60876L14 8.05V5.95L13.5843 5.39127L12.0181 4.92142L12.7934 3.48175L12.6922 2.79271L11.2073 1.30779L10.5183 1.20666L9.07861 1.98187L8.60876 0.415715L8.05 0H5.95ZM5.80938 3.08221L6.384 1.16667H7.616L8.19062 3.08221L8.45857 3.18469C8.52864 3.21151 8.59779 3.2402 8.666 3.27071L8.92803 3.38798L10.6892 2.43964L11.5603 3.31077L10.612 5.07197L10.7293 5.33402C10.7598 5.40221 10.7885 5.47136 10.8153 5.54143L10.9178 5.80938L12.8333 6.384V7.616L10.9178 8.19062L10.8153 8.45857C10.7885 8.52864 10.7598 8.59779 10.7293 8.66592L10.612 8.92803L11.5603 10.6892L10.6892 11.5603L8.92803 10.612L8.666 10.7293C8.59779 10.7598 8.52864 10.7885 8.45857 10.8153L8.19062 10.9178L7.616 12.8333H6.384L5.80938 10.9178L5.54143 10.8153C5.47136 10.7885 5.4022 10.7598 5.33402 10.7293L5.07197 10.612L3.31077 11.5603L2.43964 10.6892L3.38798 8.92803L3.27071 8.666C3.2402 8.59779 3.21151 8.52864 3.18469 8.45857L3.08221 8.19062L1.16667 7.616V6.384L3.08221 5.80938L3.18469 5.54143C3.2115 5.47136 3.24019 5.40222 3.2707 5.33404L3.38797 5.07199L2.43962 3.31077L3.31075 2.43963L5.07197 3.38798L5.33402 3.27071C5.40221 3.2402 5.47136 3.21151 5.54143 3.18469L5.80938 3.08221ZM8.75 7C8.75 7.96647 7.96647 8.75 7 8.75C6.03353 8.75 5.25 7.96647 5.25 7C5.25 6.03353 6.03353 5.25 7 5.25C7.96647 5.25 8.75 6.03353 8.75 7ZM9.91667 7C9.91667 8.61086 8.61086 9.91667 7 9.91667C5.38917 9.91667 4.08333 8.61086 4.08333 7C4.08333 5.38917 5.38917 4.08333 7 4.08333C8.61086 4.08333 9.91667 5.38917 9.91667 7Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default SettingsIcon;
