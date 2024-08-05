import type { FunctionComponent } from "react";

interface Props {
  className?: string;
}

const ChatIcon: FunctionComponent<Props> = ({ className }) => {
  return (
    <svg
      width="14"
      height="12"
      className={className}
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.90112 5.26963C6.73652 5.27056 6.57589 5.31823 6.4395 5.40662C6.30311 5.49502 6.19707 5.62018 6.13475 5.76633C6.07243 5.91247 6.05662 6.07305 6.08932 6.2278C6.12203 6.38255 6.20177 6.52454 6.3185 6.63587C6.43523 6.74719 6.58372 6.82286 6.74523 6.85333C6.90674 6.88379 7.07403 6.86769 7.22601 6.80705C7.37799 6.74642 7.50785 6.64396 7.5992 6.51261C7.69055 6.38126 7.7393 6.22689 7.7393 6.069C7.73898 5.96371 7.71704 5.85952 7.67475 5.76237C7.63245 5.66522 7.57062 5.57702 7.49279 5.50279C7.41496 5.42856 7.32265 5.36977 7.22113 5.32976C7.11961 5.28976 7.01087 5.26932 6.90112 5.26963ZM4.20086 5.26963C4.03626 5.27056 3.87563 5.31823 3.73924 5.40662C3.60285 5.49502 3.49681 5.62018 3.43449 5.76633C3.37216 5.91247 3.35636 6.07305 3.38906 6.2278C3.42176 6.38255 3.50151 6.52454 3.61824 6.63587C3.73497 6.74719 3.88346 6.82286 4.04496 6.85333C4.20647 6.88379 4.37377 6.86769 4.52575 6.80705C4.67773 6.74642 4.80758 6.64396 4.89893 6.51261C4.99028 6.38126 5.03903 6.22689 5.03904 6.069C5.03839 5.85678 4.95005 5.65346 4.79339 5.50362C4.63673 5.35377 4.42453 5.26963 4.2033 5.26963H4.20086ZM9.59894 5.26963C9.43434 5.27056 9.27371 5.31823 9.13732 5.40662C9.00093 5.49502 8.89489 5.62018 8.83257 5.76633C8.77025 5.91247 8.75444 6.07305 8.78714 6.2278C8.81985 6.38255 8.89959 6.52454 9.01632 6.63587C9.13305 6.74719 9.28154 6.82286 9.44305 6.85333C9.60455 6.88379 9.77185 6.86769 9.92383 6.80705C10.0758 6.74642 10.2057 6.64396 10.297 6.51261C10.3884 6.38126 10.4371 6.22689 10.4371 6.069C10.4365 5.85678 10.3481 5.65346 10.1915 5.50362C10.0348 5.35377 9.82261 5.26963 9.60138 5.26963H9.59894ZM13.3573 3.9733C12.9785 3.40601 12.4458 2.90436 11.7763 2.48241C10.4835 1.66663 8.78519 1.21655 6.99398 1.21655C6.40401 1.21628 5.8152 1.26649 5.23453 1.36658C4.87166 1.03166 4.46506 0.743271 4.02491 0.508611C2.39742 -0.274344 0.96054 0.0163341 0.232324 0.267161C0.177267 0.28595 0.128 0.317684 0.0890326 0.359459C0.0500651 0.401235 0.0226412 0.451718 0.00927021 0.506289C-0.00410077 0.56086 -0.00299179 0.617777 0.0124957 0.67183C0.0279831 0.725884 0.0573545 0.775349 0.0979221 0.815698C0.608651 1.32438 1.45661 2.32769 1.24889 3.24192C0.440037 4.0366 0.000175083 4.99536 0.000175083 5.99164C0.000175083 7.00901 0.440037 7.96543 1.24889 8.76011C1.45661 9.67434 0.608651 10.6776 0.0979221 11.1863C0.0579618 11.2269 0.0291784 11.2763 0.0141812 11.3302C-0.00081608 11.3841 -0.00155296 11.4408 0.0120374 11.495C0.0256277 11.5492 0.0531154 11.5994 0.0920088 11.6409C0.130902 11.6823 0.179971 11.7138 0.234768 11.7325C0.96054 11.9834 2.39742 12.274 4.0298 11.4934C4.46992 11.2587 4.87651 10.9703 5.23942 10.6355C5.82008 10.7355 6.4089 10.7858 6.99887 10.7855C8.79008 10.7855 10.4884 10.3354 11.7811 9.51962C12.4507 9.09767 12.981 8.59602 13.3622 8.02873C13.785 7.39814 14 6.71833 14 6.01039C13.9976 5.2837 13.7825 4.60389 13.3598 3.9733H13.3573ZM6.92556 9.6087C6.1882 9.61069 5.45374 9.52006 4.74091 9.33912L4.24973 9.79389C3.97702 10.0452 3.67243 10.2626 3.34312 10.4409C2.94221 10.6337 2.50694 10.7522 2.06019 10.7902C2.08463 10.748 2.10662 10.7058 2.12862 10.6636C2.62224 9.79311 2.75501 9.01094 2.52694 8.31706C1.72052 7.70757 1.23668 6.92931 1.23668 6.08072C1.23668 4.13271 3.78543 2.55273 6.92556 2.55273C10.0657 2.55273 12.6169 4.13271 12.6169 6.08072C12.6169 8.02873 10.0681 9.6087 6.92556 9.6087Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ChatIcon;