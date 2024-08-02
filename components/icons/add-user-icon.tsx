import type { FunctionComponent } from "react";
import { IconSize } from ".";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const AddUserIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 46}
      height={IconSize[size] || 45}
      className={className}
      viewBox="0 0 45 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.8038 18.5662C12.7241 18.5662 12.6472 18.5364 12.5883 18.4828C12.5294 18.4291 12.4925 18.3555 12.4849 18.2761C12.2061 15.2973 12.8529 12.9212 14.4074 11.2141C16.7157 8.67956 20.5028 8.14746 23.2735 8.14746C24.8402 8.14746 25.9331 8.31936 25.9787 8.32688C26.0477 8.3378 26.1111 8.37102 26.1593 8.42145C26.2075 8.47188 26.2379 8.53673 26.2457 8.60606C26.2539 8.67531 26.2392 8.74534 26.2039 8.80546C26.1686 8.86559 26.1146 8.9125 26.0501 8.93904C24.6052 9.53327 24.7608 10.9475 24.8872 11.5079C25.4749 11.4848 26.6984 11.6208 27.6049 12.6796C28.5902 13.8306 28.8866 15.72 28.4852 18.2955C28.4755 18.3586 28.4471 18.4173 28.4036 18.4641C28.3601 18.5108 28.3036 18.5434 28.2414 18.5577C28.1791 18.5724 28.1139 18.568 28.0541 18.5451C27.9943 18.5223 27.9428 18.482 27.9062 18.4295L25.8181 15.4464C25.0834 15.7663 22.8483 16.6456 20.4694 16.6456C18.0942 16.6456 15.8841 15.7687 15.1535 15.4474L13.066 18.4296C13.0365 18.4718 12.9972 18.5062 12.9516 18.53C12.9059 18.5538 12.8552 18.5662 12.8038 18.5662ZM25.9281 14.725C26.0294 14.725 26.1288 14.7734 26.1907 14.8615L27.9574 17.3861C28.1575 15.4217 27.8762 13.9809 27.1184 13.0959C26.412 12.2706 25.4591 12.1475 24.9547 12.1475C24.8002 12.1475 24.7027 12.1597 24.6928 12.1609C24.5451 12.18 24.3957 12.0934 24.3451 11.949C24.0863 11.2031 23.9725 9.7733 24.9791 8.85858C24.5339 8.82103 23.9463 8.78764 23.2735 8.78764C20.632 8.78764 17.0317 9.28339 14.8807 11.6452C13.6103 13.0403 13.002 14.9434 13.067 17.3117L14.7823 14.8615C14.8258 14.7989 14.8904 14.7539 14.9643 14.7348C15.0382 14.7157 15.1164 14.7238 15.1849 14.7575C15.2105 14.7699 17.7749 16.0053 20.4695 16.0053C23.1709 16.0053 25.7631 14.7693 25.7893 14.7568C25.8325 14.7358 25.88 14.7249 25.9281 14.725ZM15.0445 27.5292C15.0024 27.5292 14.9608 27.521 14.9219 27.5049C14.8831 27.4888 14.8478 27.4652 14.8181 27.4355C14.7883 27.4058 14.7648 27.3705 14.7487 27.3316C14.7326 27.2928 14.7244 27.2511 14.7244 27.2091V26.5688C14.7244 26.392 14.8675 26.2487 15.0445 26.2487C15.2214 26.2487 15.3646 26.392 15.3646 26.5688V27.2091C15.3646 27.2511 15.3563 27.2928 15.3403 27.3316C15.3242 27.3705 15.3006 27.4058 15.2709 27.4355C15.2412 27.4652 15.2059 27.4888 15.167 27.5049C15.1282 27.521 15.0865 27.5292 15.0445 27.5292Z"
        fill="#575757"
      />
      <path
        d="M17.6059 30.7302C17.5578 30.7302 17.5103 30.7194 17.467 30.6986C17.4237 30.6779 17.3855 30.6476 17.3554 30.6102L14.7946 27.4092C14.7417 27.3428 14.7172 27.2581 14.7266 27.1737C14.736 27.0893 14.7784 27.0121 14.8447 26.959C14.9111 26.9061 14.9957 26.8818 15.0801 26.8911C15.1644 26.9005 15.2416 26.9429 15.2948 27.009L17.8557 30.21C17.9086 30.2764 17.9331 30.361 17.9237 30.4454C17.9143 30.5298 17.8719 30.607 17.8056 30.6601C17.749 30.7057 17.6785 30.7304 17.6059 30.7302Z"
        fill="#575757"
      />
      <path
        d="M37.3753 19.1708C37.2957 19.1707 37.219 19.141 37.16 19.0875C37.1011 19.034 37.0642 18.9605 37.0565 18.8813C36.2976 10.9515 29.9904 4.65719 22.0578 3.91445C22.016 3.91053 21.9753 3.89841 21.9381 3.87877C21.901 3.85913 21.868 3.83236 21.8412 3.79999C21.8144 3.76762 21.7942 3.73028 21.7818 3.69011C21.7694 3.64993 21.7651 3.60771 21.769 3.56586C21.7852 3.38956 21.9435 3.25761 22.1178 3.27675C30.3556 4.04823 36.9058 10.5851 37.6942 18.82C37.6984 18.8644 37.6932 18.9092 37.6791 18.9515C37.665 18.9938 37.6422 19.0328 37.6122 19.0658C37.5822 19.0988 37.5456 19.1252 37.5048 19.1432C37.464 19.1613 37.4199 19.1707 37.3753 19.1708Z"
        fill="#575757"
      />
      <path
        d="M3.59589 19.2069C3.55132 19.2069 3.50723 19.1977 3.46644 19.1797C3.42566 19.1617 3.38907 19.1354 3.35903 19.1025C3.32899 19.0695 3.30616 19.0307 3.29199 18.9884C3.27783 18.9462 3.27264 18.9014 3.27676 18.857C4.04945 10.6021 10.6013 4.04963 18.8559 3.27663C19.0319 3.25821 19.1879 3.38944 19.2045 3.56573C19.2123 3.6503 19.1862 3.73451 19.132 3.79987C19.0778 3.86523 18.9998 3.90639 18.9153 3.91433C10.9671 4.65867 4.65817 10.968 3.91446 18.9164C3.90702 18.9958 3.87024 19.0696 3.81134 19.1233C3.75243 19.177 3.67561 19.2068 3.59589 19.2069Z"
        fill="#575757"
      />
      <path
        d="M18.8859 37.6982C18.8759 37.6982 18.8659 37.6976 18.8559 37.6969C10.6017 36.9248 4.0498 30.3727 3.2768 22.1174C3.27286 22.0755 3.27721 22.0332 3.28962 21.993C3.30202 21.9528 3.32222 21.9155 3.34907 21.8831C3.37592 21.8507 3.40889 21.8239 3.44609 21.8042C3.4833 21.7846 3.52401 21.7725 3.5659 21.7686C3.73724 21.7517 3.89784 21.8818 3.9145 22.0574C4.65852 30.0062 10.9675 36.3158 18.9153 37.0592C18.9998 37.0672 19.0777 37.1083 19.1319 37.1736C19.1861 37.2389 19.2122 37.323 19.2045 37.4075C19.1971 37.4869 19.1604 37.5607 19.1015 37.6145C19.0426 37.6682 18.9657 37.6981 18.8859 37.6982Z"
        fill="#575757"
      />
      <path
        d="M39.3058 19.2063C39.2256 19.2062 39.1484 19.176 39.0895 19.1217C39.0306 19.0674 38.9942 18.9929 38.9875 18.913C38.2285 9.86414 31.1099 2.7455 22.0607 1.98619C22.0188 1.98267 21.9781 1.97093 21.9407 1.95165C21.9034 1.93237 21.8702 1.90592 21.8431 1.87382C21.816 1.84171 21.7955 1.80458 21.7827 1.76454C21.7699 1.72451 21.7652 1.68235 21.7687 1.64047C21.7722 1.5986 21.7839 1.55782 21.8032 1.52047C21.8225 1.48313 21.8489 1.44995 21.881 1.42284C21.9132 1.39573 21.9503 1.37521 21.9903 1.36247C22.0304 1.34972 22.0725 1.345 22.1144 1.34857C31.4757 2.13382 38.8405 9.49809 39.6252 18.8593C39.6291 18.9035 39.6236 18.948 39.6093 18.99C39.595 19.032 39.572 19.0706 39.542 19.1032C39.5119 19.1358 39.4754 19.1619 39.4347 19.1796C39.3941 19.1974 39.3502 19.2064 39.3058 19.2063Z"
        fill="#575757"
      />
      <path
        d="M18.8867 39.6256C18.8777 39.6256 18.8689 39.6256 18.8595 39.6243C9.49832 38.8391 2.13373 31.4754 1.34879 22.1141C1.34526 22.0723 1.35 22.0301 1.36276 21.9901C1.37552 21.9501 1.39604 21.9129 1.42314 21.8808C1.45025 21.8487 1.48341 21.8223 1.52074 21.803C1.55807 21.7837 1.59883 21.772 1.6407 21.7684C1.8242 21.7522 1.97208 21.8848 1.98641 22.0604C2.74541 31.1091 9.86404 38.2276 18.9132 38.9866C18.9978 38.9937 19.0761 39.0342 19.1308 39.099C19.1856 39.1638 19.2123 39.2478 19.2052 39.3323C19.1986 39.4122 19.1622 39.4868 19.1032 39.5411C19.0442 39.5954 18.9669 39.6256 18.8867 39.6256Z"
        fill="#575757"
      />
      <path
        d="M6.72225 20.8067H0.320092C0.143153 20.8067 0 20.6635 0 20.4866C0 20.3097 0.143153 20.1665 0.320092 20.1665H6.72217C6.8991 20.1665 7.04234 20.3097 7.04234 20.4866C7.04234 20.6635 6.89918 20.8067 6.72225 20.8067Z"
        fill="#575757"
      />
      <path
        d="M20.4861 45.9735C20.4441 45.9735 20.4024 45.9653 20.3636 45.9492C20.3247 45.9331 20.2894 45.9095 20.2597 45.8798C20.23 45.8501 20.2064 45.8148 20.1903 45.7759C20.1742 45.7371 20.166 45.6954 20.166 45.6534V39.2513C20.166 39.0743 20.3092 38.9312 20.4861 38.9312C20.663 38.9312 20.8062 39.0743 20.8062 39.2513V45.6534C20.8062 45.6954 20.798 45.7371 20.7819 45.7759C20.7658 45.8148 20.7422 45.8501 20.7125 45.8798C20.6828 45.9095 20.6475 45.9331 20.6086 45.9492C20.5698 45.9653 20.5282 45.9735 20.4861 45.9735Z"
        fill="#575757"
      />
      <path
        d="M20.4861 7.04234C20.4441 7.04236 20.4024 7.03409 20.3636 7.01801C20.3247 7.00192 20.2894 6.97834 20.2597 6.9486C20.23 6.91887 20.2064 6.88356 20.1903 6.84471C20.1742 6.80585 20.166 6.76421 20.166 6.72217V0.320092C20.166 0.143153 20.3092 0 20.4861 0C20.663 0 20.8062 0.143153 20.8062 0.320092V6.72217C20.8062 6.76421 20.798 6.80585 20.7819 6.84471C20.7658 6.88356 20.7422 6.91887 20.7125 6.9486C20.6828 6.97834 20.6475 7.00192 20.6086 7.01801C20.5698 7.03409 20.5282 7.04236 20.4861 7.04234Z"
        fill="#575757"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1824 31.6904C20.1824 31.8674 20.329 32.0105 20.5057 32.0105C20.5477 32.0105 20.5893 32.0023 20.6282 31.9862C20.667 31.9701 20.7023 31.9465 20.7321 31.9168C20.7618 31.8871 20.7854 31.8518 20.8015 31.8129C20.8175 31.7741 20.8258 31.7324 20.8258 31.6904C20.8258 31.6484 20.8175 31.6067 20.8014 31.5679C20.7854 31.529 20.7618 31.4937 20.732 31.464C20.7023 31.4343 20.667 31.4107 20.6282 31.3946C20.5893 31.3785 20.5477 31.3703 20.5057 31.3703H20.4994C20.3225 31.3703 20.1824 31.5135 20.1824 31.6904ZM8.48655 30.8226C8.53429 30.8492 8.58802 30.8631 8.64266 30.8632C8.7019 30.863 8.75997 30.8466 8.81055 30.8158C9.1284 30.6195 9.53696 30.4306 10.0956 30.2212C11.0879 29.851 13.2951 28.9857 14.5468 28.3662C14.6229 28.3284 14.6809 28.2619 14.708 28.1814C14.7352 28.1008 14.7293 28.0128 14.6916 27.9366C14.6125 27.7791 14.4214 27.7129 14.2624 27.7922C13.0342 28.4005 10.8534 29.2552 9.87154 29.6221C9.27299 29.846 8.82872 30.0523 8.4742 30.2706C8.40201 30.3152 8.35047 30.3867 8.3309 30.4694C8.31133 30.552 8.32532 30.639 8.3698 30.7113C8.39863 30.7577 8.43881 30.796 8.48655 30.8226ZM12.484 18.8712C12.484 24.1641 17.4719 28.8094 20.4866 28.8094C20.886 28.8094 21.3201 28.7279 21.7726 28.5741C21.8714 28.3011 21.9792 28.0324 22.0954 27.7682C21.5257 28.0277 20.9775 28.1692 20.4866 28.1692C17.7172 28.1692 13.1242 23.6653 13.1242 18.8712C13.1242 18.6943 12.981 18.551 12.8041 18.551C12.6271 18.551 12.484 18.6943 12.484 18.8712ZM27.2805 21.8689C27.5533 21.7039 27.8326 21.5486 28.118 21.4036C28.3553 20.5886 28.4892 19.7386 28.4892 18.8712C28.4892 18.6943 28.3461 18.551 28.1691 18.551C27.9922 18.551 27.849 18.6943 27.849 18.8712C27.849 19.8975 27.6386 20.9105 27.2805 21.8689Z"
        fill="#575757"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38.5176 20.8067H40.6521C40.8291 20.8067 40.9722 20.6635 40.9722 20.4866C40.9722 20.3097 40.8291 20.1665 40.6521 20.1665H36.0859C36.9262 20.3021 37.7395 20.5182 38.5176 20.8067Z"
        fill="#575757"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.5774 29.1572L20.9496 28.8433C20.8737 28.8054 20.7858 28.7992 20.7053 28.826C20.6248 28.8528 20.5582 28.9106 20.5202 28.9865C20.5014 29.0241 20.4901 29.065 20.4871 29.1069C20.4841 29.1489 20.4895 29.191 20.5027 29.2309C20.516 29.2708 20.5371 29.3077 20.5646 29.3394C20.5922 29.3712 20.6257 29.3972 20.6633 29.416L21.4007 29.7847C21.4545 29.5734 21.5134 29.3642 21.5774 29.1572Z"
        fill="#575757"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.4372 30.6823C17.4879 30.7135 17.5462 30.7301 17.6057 30.7301C17.6553 30.7299 17.7041 30.7184 17.7485 30.6963L20.3093 29.4159C20.347 29.3972 20.3805 29.3711 20.4081 29.3394C20.4356 29.3076 20.4566 29.2707 20.4699 29.2308C20.4832 29.191 20.4885 29.1488 20.4855 29.1069C20.4825 29.065 20.4713 29.024 20.4525 28.9864C20.4145 28.9105 20.3479 28.8529 20.2674 28.826C20.1869 28.7992 20.099 28.8054 20.023 28.8433L17.4622 30.1237C17.4246 30.1425 17.3911 30.1685 17.3635 30.2002C17.3359 30.232 17.3149 30.2689 17.3016 30.3087C17.2883 30.3486 17.283 30.3907 17.286 30.4327C17.2889 30.4746 17.3002 30.5156 17.319 30.5532C17.3457 30.6063 17.3866 30.651 17.4372 30.6823Z"
        fill="#575757"
      />
      <mask id="path-15-inside-1_902_3802" fill="white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33.5 44C39.8513 44 45 38.8513 45 32.5C45 26.1487 39.8513 21 33.5 21C27.1487 21 22 26.1487 22 32.5C22 38.8513 27.1487 44 33.5 44ZM22.8846 32.5C22.8846 26.6615 27.6615 21.8846 33.5 21.8846C39.3385 21.8846 44.1154 26.6615 44.1154 32.5C44.1154 38.3385 39.3385 43.1154 33.5 43.1154C27.6615 43.1154 22.8846 38.3385 22.8846 32.5ZM34.8269 33.8269H37.4808C38.2769 33.8269 38.8077 33.2962 38.8077 32.5C38.8077 31.7038 38.2769 31.1731 37.4808 31.1731H34.8269V28.5192C34.8269 27.7231 34.2962 27.1923 33.5 27.1923C32.7038 27.1923 32.1731 27.7231 32.1731 28.5192V31.1731H29.5192C28.7231 31.1731 28.1923 31.7038 28.1923 32.5C28.1923 33.2962 28.7231 33.8269 29.5192 33.8269H32.1731V36.4808C32.1731 37.2769 32.7038 37.8077 33.5 37.8077C34.2962 37.8077 34.8269 37.2769 34.8269 36.4808V33.8269Z"
        />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.5 44C39.8513 44 45 38.8513 45 32.5C45 26.1487 39.8513 21 33.5 21C27.1487 21 22 26.1487 22 32.5C22 38.8513 27.1487 44 33.5 44ZM22.8846 32.5C22.8846 26.6615 27.6615 21.8846 33.5 21.8846C39.3385 21.8846 44.1154 26.6615 44.1154 32.5C44.1154 38.3385 39.3385 43.1154 33.5 43.1154C27.6615 43.1154 22.8846 38.3385 22.8846 32.5ZM34.8269 33.8269H37.4808C38.2769 33.8269 38.8077 33.2962 38.8077 32.5C38.8077 31.7038 38.2769 31.1731 37.4808 31.1731H34.8269V28.5192C34.8269 27.7231 34.2962 27.1923 33.5 27.1923C32.7038 27.1923 32.1731 27.7231 32.1731 28.5192V31.1731H29.5192C28.7231 31.1731 28.1923 31.7038 28.1923 32.5C28.1923 33.2962 28.7231 33.8269 29.5192 33.8269H32.1731V36.4808C32.1731 37.2769 32.7038 37.8077 33.5 37.8077C34.2962 37.8077 34.8269 37.2769 34.8269 36.4808V33.8269Z"
        fill="#5E5E5E"
      />
      <path
        d="M34.8269 33.8269V32.8269H33.8269V33.8269H34.8269ZM34.8269 31.1731H33.8269V32.1731H34.8269V31.1731ZM32.1731 31.1731V32.1731H33.1731V31.1731H32.1731ZM32.1731 33.8269H33.1731V32.8269H32.1731V33.8269ZM44 32.5C44 38.299 39.299 43 33.5 43V45C40.4036 45 46 39.4036 46 32.5H44ZM33.5 22C39.299 22 44 26.701 44 32.5H46C46 25.5964 40.4036 20 33.5 20V22ZM23 32.5C23 26.701 27.701 22 33.5 22V20C26.5964 20 21 25.5964 21 32.5H23ZM33.5 43C27.701 43 23 38.299 23 32.5H21C21 39.4036 26.5964 45 33.5 45V43ZM33.5 20.8846C27.1093 20.8846 21.8846 26.1093 21.8846 32.5H23.8846C23.8846 27.2138 28.2138 22.8846 33.5 22.8846V20.8846ZM45.1154 32.5C45.1154 26.1093 39.8907 20.8846 33.5 20.8846V22.8846C38.7862 22.8846 43.1154 27.2138 43.1154 32.5H45.1154ZM33.5 44.1154C39.8907 44.1154 45.1154 38.8907 45.1154 32.5H43.1154C43.1154 37.7862 38.7862 42.1154 33.5 42.1154V44.1154ZM21.8846 32.5C21.8846 38.8907 27.1093 44.1154 33.5 44.1154V42.1154C28.2138 42.1154 23.8846 37.7862 23.8846 32.5H21.8846ZM37.4808 32.8269H34.8269V34.8269H37.4808V32.8269ZM37.8077 32.5C37.8077 32.6708 37.7551 32.7355 37.7357 32.7549C37.7163 32.7743 37.6516 32.8269 37.4808 32.8269V34.8269C38.1061 34.8269 38.7049 34.6141 39.1499 34.1691C39.5949 33.7241 39.8077 33.1253 39.8077 32.5H37.8077ZM37.4808 32.1731C37.6516 32.1731 37.7163 32.2257 37.7357 32.2451C37.7551 32.2645 37.8077 32.3292 37.8077 32.5H39.8077C39.8077 31.8747 39.5949 31.2759 39.1499 30.8309C38.7049 30.3859 38.1061 30.1731 37.4808 30.1731V32.1731ZM34.8269 32.1731H37.4808V30.1731H34.8269V32.1731ZM33.8269 28.5192V31.1731H35.8269V28.5192H33.8269ZM33.5 28.1923C33.6708 28.1923 33.7355 28.2449 33.7549 28.2643C33.7743 28.2838 33.8269 28.3484 33.8269 28.5192H35.8269C35.8269 27.8939 35.6141 27.2951 35.1691 26.8501C34.7241 26.4051 34.1253 26.1923 33.5 26.1923V28.1923ZM33.1731 28.5192C33.1731 28.3484 33.2257 28.2838 33.2451 28.2643C33.2645 28.2449 33.3292 28.1923 33.5 28.1923V26.1923C32.8747 26.1923 32.2759 26.4051 31.8309 26.8501C31.3859 27.2951 31.1731 27.8939 31.1731 28.5192H33.1731ZM33.1731 31.1731V28.5192H31.1731V31.1731H33.1731ZM29.5192 32.1731H32.1731V30.1731H29.5192V32.1731ZM29.1923 32.5C29.1923 32.3292 29.2449 32.2645 29.2643 32.2451C29.2838 32.2257 29.3484 32.1731 29.5192 32.1731V30.1731C28.8939 30.1731 28.2951 30.3859 27.8501 30.8309C27.4051 31.2759 27.1923 31.8747 27.1923 32.5H29.1923ZM29.5192 32.8269C29.3484 32.8269 29.2838 32.7743 29.2643 32.7549C29.2449 32.7355 29.1923 32.6708 29.1923 32.5H27.1923C27.1923 33.1253 27.4051 33.7241 27.8501 34.1691C28.2951 34.6141 28.8939 34.8269 29.5192 34.8269V32.8269ZM32.1731 32.8269H29.5192V34.8269H32.1731V32.8269ZM33.1731 36.4808V33.8269H31.1731V36.4808H33.1731ZM33.5 36.8077C33.3292 36.8077 33.2645 36.7551 33.2451 36.7357C33.2257 36.7163 33.1731 36.6516 33.1731 36.4808H31.1731C31.1731 37.1061 31.3859 37.7049 31.8309 38.1499C32.2759 38.5949 32.8747 38.8077 33.5 38.8077V36.8077ZM33.8269 36.4808C33.8269 36.6516 33.7743 36.7163 33.7549 36.7357C33.7355 36.7551 33.6708 36.8077 33.5 36.8077V38.8077C34.1253 38.8077 34.7241 38.5949 35.1691 38.1499C35.6141 37.7049 35.8269 37.1061 35.8269 36.4808H33.8269ZM33.8269 33.8269V36.4808H35.8269V33.8269H33.8269Z"
        fill="#575757"
        mask="url(#path-15-inside-1_902_3802)"
      />
    </svg>
  );
};

export default AddUserIcon;
