import type { FunctionComponent } from "react";

interface Props {
  className?: string;
}

const VideoIcon: FunctionComponent<Props> = ({ className }) => {
  return (
    <svg
      width="14"
      height="10"
      className={className}
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.90909 1.25C1.55764 1.25 1.27273 1.52982 1.27273 1.875V8.125C1.27273 8.47019 1.55764 8.75 1.90909 8.75H8.27273C8.62419 8.75 8.90909 8.47019 8.90909 8.125V7.45894C8.90909 6.71013 9.75876 6.2635 10.3932 6.67888L12.7273 8.20719V1.79282L10.3932 3.32114C9.75876 3.73648 8.90909 3.28986 8.90909 2.54109V1.875C8.90909 1.52982 8.62419 1.25 8.27273 1.25H1.90909ZM0 1.875C0 0.839469 0.854732 0 1.90909 0H8.27273C9.32712 0 10.1818 0.839469 10.1818 1.875V1.95718L12.0213 0.752763C12.8671 0.198963 14 0.79445 14 1.79282V8.20719C14 9.20556 12.8671 9.80106 12.0213 9.24725L10.1818 8.04281V8.125C10.1818 9.16056 9.32712 10 8.27273 10H1.90909C0.854732 10 0 9.16056 0 8.125V1.875Z"
        fill="white"
      />
    </svg>
  );
};

export default VideoIcon;
