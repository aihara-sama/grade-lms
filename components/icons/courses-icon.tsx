import type { FunctionComponent } from "react";

interface Props {
  className?: string;
}

const CoursesIcon: FunctionComponent<Props> = ({ className }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.9462 4.53731C13.9462 4.48425 14 4.43118 14 4.37811C14 4.37811 14 4.37811 14 4.32504C14 4.32504 14 4.32504 14 4.27197C14 4.2189 14 4.16584 14 4.11277C14 4.11277 14 4.11277 14 4.0597C14 4.00663 13.9462 3.95357 13.9462 3.9005C13.8923 3.84743 13.8923 3.84743 13.8385 3.79436L7.91539 0.079602C7.75385 -0.026534 7.48462 -0.026534 7.32308 0.079602L0.323077 4.85572L0.269231 4.90879C0.269231 4.90879 0.269231 4.90879 0.215385 4.90879C0.161539 4.96186 0.161538 5.01493 0.107692 5.06799C0.107692 5.06799 0.107692 5.06799 0.107692 5.12106C2.40711e-08 5.28027 0 5.33333 0 5.3864V8.57048V11.7546C0 11.9138 0.107692 12.126 0.269231 12.1791L6.19231 15.8939C6.3 15.9469 6.40769 16 6.46154 16C6.56923 16 6.67692 15.9469 6.78462 15.8939L13.7846 11.1177C13.8923 11.0116 14 10.9055 14 10.7463C14 10.5871 13.9462 10.4279 13.8385 10.3217C13.3538 9.84411 13.2462 9.15423 13.5692 8.51741L13.9462 7.72139C13.9462 7.66832 14 7.61526 14 7.56219V7.50912C14 7.45605 14 7.34992 13.9462 7.29685V7.24378C13.9462 7.19071 13.8923 7.13764 13.8385 7.08458C13.3538 6.60697 13.2462 5.91708 13.5692 5.28027L13.9462 4.53731ZM12.7077 7.40299L6.46154 11.6484L1.07692 8.30514V6.39469L6.19231 9.57877C6.3 9.63184 6.40769 9.68491 6.46154 9.68491C6.56923 9.68491 6.67692 9.63184 6.78462 9.57877L12.3308 5.81095C12.2769 6.34163 12.3846 6.8723 12.7077 7.40299ZM6.46154 14.8325L1.07692 11.4892V9.57877L6.19231 12.7629C6.3 12.8159 6.40769 12.869 6.46154 12.869C6.56923 12.869 6.67692 12.8159 6.78462 12.7629L12.3308 8.99502C12.2769 9.57877 12.3846 10.1625 12.7077 10.6401L6.46154 14.8325Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default CoursesIcon;
