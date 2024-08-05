import type { FunctionComponent } from "react";

interface IProps {
  className?: string;
}

const MembersIcon: FunctionComponent<IProps> = ({ className }) => {
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
        d="M4.26176 9.672C3.91176 8.916 3.70588 8.02 3.70588 7.04C3.70588 5.388 4.22059 3.988 5.04412 3.148C4.73529 2.448 4.22059 2 3.5 2C2.30588 2 1.64706 3.288 1.64706 4.8C1.64706 5.612 1.85294 6.284 2.24412 6.788C2.47059 7.068 2.65588 7.432 2.65588 7.824C2.65588 8.216 2.55294 8.552 1.87353 8.944C0.905882 9.532 0.0205882 10.288 0 11.52C0 12.332 0.391177 12.92 0.947059 12.92H1.83235C1.97647 12.92 2.12059 12.808 2.18235 12.64C2.61471 11.576 3.41765 10.904 4.09706 10.456C4.32353 10.316 4.40588 9.952 4.26176 9.672Z"
        fill="currentColor"
      />
      <path
        d="M12.1264 6.944C11.447 6.552 11.344 6.188 11.344 5.824C11.344 5.432 11.5293 5.068 11.7558 4.788C12.147 4.284 12.3529 3.612 12.3529 2.8C12.3529 1.288 11.694 0 10.4999 0C9.77934 0 9.26463 0.448 8.95581 1.148C9.77934 1.988 10.294 3.36 10.294 5.04C10.294 6.02 10.1088 6.916 9.73816 7.672C9.59405 7.952 9.6764 8.316 9.90287 8.484C10.5823 8.932 11.3852 9.604 11.8176 10.668C11.8793 10.836 12.0235 10.948 12.1676 10.948H13.0529C13.6088 10.948 13.9999 10.36 13.9999 9.548C13.9793 8.316 13.094 7.532 12.1264 6.944Z"
        fill="currentColor"
      />
      <path
        d="M8.79132 9.63202C8.05014 9.21202 7.9472 8.82002 7.9472 8.40002C7.9472 7.98002 8.15308 7.56002 8.40014 7.25202C8.8325 6.72002 9.07956 5.93602 9.07956 5.04002C9.07956 3.38802 8.33838 1.96002 7.02073 1.96002C5.70308 1.96002 4.96191 3.38802 4.96191 5.04002C4.96191 5.93602 5.20897 6.69202 5.64132 7.25202C5.88838 7.56002 6.09426 7.98002 6.09426 8.40002C6.09426 8.82002 5.97073 9.21202 5.25014 9.63202C4.13838 10.248 3.10897 10.976 3.08838 12.32C3.08838 13.216 3.56191 14 4.17956 14H7.00014H9.82073C10.4384 14 10.9119 13.216 10.9119 12.32C10.8913 10.976 9.86191 10.248 8.79132 9.63202Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default MembersIcon;