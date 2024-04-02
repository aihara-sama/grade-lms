import type { FunctionComponent } from "react";
interface Props {
	className?: string;
}
const OverviewIcon: FunctionComponent<Props> = ({ className }) => {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 0V6.22222H6.22222V0H0ZM4.66667 4.66667H1.55556V1.55556H4.66667V4.66667ZM0 7.77778V14H6.22222V7.77778H0ZM4.66667 12.4444H1.55556V9.33333H4.66667V12.4444ZM7.77778 0V6.22222H14V0H7.77778ZM12.4444 4.66667H9.33333V1.55556H12.4444V4.66667ZM7.77778 7.77778V14H14V7.77778H7.77778ZM12.4444 12.4444H9.33333V9.33333H12.4444V12.4444Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export default OverviewIcon;
