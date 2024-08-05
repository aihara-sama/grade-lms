import { IconSize } from "@/components/icons";
import type { FunctionComponent } from "react";

interface Props {
  className?: string;
  size?: keyof typeof IconSize;
}

const AvatarIcon: FunctionComponent<Props> = ({ className, size }) => {
  return (
    <svg
      width={IconSize[size] || 30}
      height={IconSize[size] || 30}
      className={className}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.0005 23.4168C14.8713 23.4168 14.764 23.3122 14.764 23.1827C14.764 23.0533 14.8664 22.9485 14.9959 22.9485H15.0005C15.0312 22.9485 15.0617 22.9546 15.0901 22.9663C15.1185 22.9781 15.1443 22.9953 15.1661 23.0171C15.1878 23.0388 15.2051 23.0646 15.2168 23.0931C15.2286 23.1215 15.2346 23.1519 15.2346 23.1827C15.2346 23.2134 15.2286 23.2439 15.2168 23.2723C15.2051 23.3007 15.1878 23.3266 15.1661 23.3483C15.1443 23.3701 15.1185 23.3873 15.0901 23.3991C15.0617 23.4108 15.0312 23.4169 15.0005 23.4168ZM6.32227 22.5776C6.2823 22.5775 6.243 22.5673 6.20807 22.5479C6.17315 22.5284 6.14375 22.5004 6.12266 22.4665C6.09013 22.4135 6.07989 22.3499 6.09421 22.2895C6.10853 22.229 6.14622 22.1767 6.19904 22.144C6.45838 21.9844 6.78338 21.8334 7.22124 21.6697C7.93953 21.4013 9.53482 20.776 10.4333 20.331C10.5496 20.273 10.6894 20.3214 10.7473 20.4367C10.7748 20.4924 10.7792 20.5568 10.7593 20.6157C10.7394 20.6746 10.697 20.7232 10.6414 20.7509C9.7257 21.2041 8.11101 21.8371 7.38517 22.1079C6.97648 22.2611 6.6776 22.3993 6.44509 22.5429C6.40809 22.5655 6.36561 22.5775 6.32227 22.5776ZM23.6516 22.5785C23.6083 22.5785 23.5658 22.5663 23.5291 22.5433C23.2967 22.3997 22.9976 22.2615 22.5873 22.1078C21.8629 21.8375 20.2503 21.2055 19.3318 20.7509C19.2762 20.7233 19.2338 20.6747 19.2139 20.6159C19.1941 20.5571 19.1983 20.4928 19.2257 20.4371C19.2393 20.4095 19.2582 20.3849 19.2814 20.3646C19.3045 20.3443 19.3314 20.3288 19.3606 20.319C19.3897 20.3091 19.4205 20.3051 19.4512 20.3071C19.4819 20.3092 19.5119 20.3173 19.5395 20.331C20.4409 20.7774 22.0344 21.4017 22.751 21.6696C23.191 21.8334 23.5162 21.9848 23.775 22.1453C23.8012 22.1614 23.824 22.1826 23.8419 22.2075C23.8599 22.2324 23.8728 22.2606 23.8799 22.2905C23.8869 22.3204 23.888 22.3515 23.883 22.3818C23.8781 22.4121 23.8672 22.4412 23.851 22.4673C23.8301 22.5014 23.8008 22.5295 23.7659 22.549C23.731 22.5685 23.6916 22.5787 23.6516 22.5785ZM14.9865 21.0752C12.7812 21.0752 9.13234 17.6769 9.13234 13.805C9.13234 13.6756 9.23706 13.5708 9.36649 13.5708C9.49593 13.5708 9.60065 13.6756 9.60065 13.805C9.60065 17.3121 12.9606 20.6068 14.9865 20.6068C17.0126 20.6068 20.3724 17.3121 20.3724 13.805C20.3724 13.6756 20.4771 13.5708 20.6065 13.5708C20.736 13.5708 20.8407 13.6756 20.8407 13.805C20.8407 17.677 17.1919 21.0752 14.9865 21.0752Z"
        fill="#575757"
      />
      <path
        d="M9.36725 13.5816C9.30895 13.5816 9.25276 13.5598 9.20964 13.5206C9.16652 13.4814 9.13956 13.4275 9.13403 13.3694C8.93003 11.1903 9.40321 9.45212 10.5404 8.20332C12.229 6.34921 14.9994 5.95996 17.0262 5.95996C18.1723 5.95996 18.9718 6.08571 19.0052 6.09121C19.0556 6.0992 19.102 6.1235 19.1373 6.16039C19.1726 6.19728 19.1948 6.24472 19.2005 6.29544C19.2065 6.3461 19.1958 6.39733 19.1699 6.44131C19.1441 6.4853 19.1046 6.51962 19.0574 6.53903C18.0004 6.97373 18.1143 8.00829 18.2067 8.41827C18.6366 8.40134 19.5317 8.50085 20.1948 9.27536C20.9156 10.1173 21.1324 11.4995 20.8388 13.3836C20.8316 13.4298 20.8108 13.4727 20.7791 13.5069C20.7473 13.5411 20.7059 13.565 20.6604 13.5754C20.6148 13.5861 20.5671 13.5829 20.5234 13.5662C20.4797 13.5495 20.442 13.52 20.4152 13.4817L18.8877 11.2994C18.3502 11.5334 16.7152 12.1766 14.9749 12.1766C13.2374 12.1766 11.6206 11.5352 11.0862 11.3001L9.55906 13.4817C9.53747 13.5126 9.50877 13.5377 9.47538 13.5551C9.44199 13.5725 9.4049 13.5816 9.36725 13.5816ZM18.9681 10.7716C19.0423 10.7716 19.115 10.8071 19.1602 10.8715L20.4527 12.7183C20.599 11.2813 20.3932 10.2273 19.8389 9.57992C19.3221 8.97619 18.6251 8.88611 18.256 8.88611C18.1431 8.88611 18.0717 8.89502 18.0645 8.89595C17.9565 8.90989 17.8472 8.84652 17.8102 8.74092C17.6208 8.19529 17.5376 7.14932 18.2739 6.48017C17.9482 6.4527 17.5184 6.42828 17.0262 6.42828C15.0939 6.42828 12.4601 6.79093 10.8866 8.51865C9.95727 9.53927 9.51226 10.9315 9.55982 12.6639L10.8146 10.8715C10.8465 10.8257 10.8937 10.7928 10.9477 10.7788C11.0018 10.7649 11.0591 10.7707 11.1091 10.7954C11.1279 10.8045 13.0038 11.7082 14.975 11.7082C16.9512 11.7082 18.8474 10.8041 18.8666 10.7949C18.8982 10.7795 18.933 10.7715 18.9681 10.7716ZM11.0064 20.1383C10.9757 20.1384 10.9452 20.1323 10.9168 20.1206C10.8884 20.1088 10.8625 20.0916 10.8408 20.0698C10.819 20.0481 10.8018 20.0222 10.79 19.9938C10.7783 19.9654 10.7722 19.9349 10.7723 19.9042V19.4358C10.7723 19.3064 10.877 19.2016 11.0064 19.2016C11.1358 19.2016 11.2406 19.3064 11.2406 19.4358V19.9042C11.2406 19.9349 11.2345 19.9654 11.2228 19.9938C11.211 20.0222 11.1938 20.0481 11.172 20.0698C11.1503 20.0916 11.1245 20.1088 11.096 20.1206C11.0676 20.1323 11.0372 20.1384 11.0064 20.1383Z"
        fill="#575757"
      />
      <path
        d="M12.8792 22.48C12.8441 22.48 12.8093 22.4721 12.7776 22.4569C12.7459 22.4417 12.718 22.4196 12.696 22.3922L10.8227 20.0506C10.784 20.002 10.7661 19.9401 10.7729 19.8783C10.7798 19.8166 10.8108 19.7601 10.8593 19.7212C10.9079 19.6826 10.9698 19.6647 11.0315 19.6716C11.0932 19.6785 11.1497 19.7095 11.1886 19.7578L13.062 22.0995C13.1007 22.148 13.1186 22.21 13.1117 22.2717C13.1049 22.3334 13.0738 22.3899 13.0253 22.4288C12.9839 22.4621 12.9324 22.4802 12.8792 22.48Z"
        fill="#575757"
      />
      <path
        d="M12.879 22.48C12.8355 22.48 12.7928 22.4679 12.7558 22.445C12.7188 22.4222 12.6888 22.3894 12.6693 22.3505C12.6555 22.323 12.6473 22.2931 12.6451 22.2624C12.6429 22.2317 12.6468 22.2009 12.6566 22.1717C12.6663 22.1426 12.6817 22.1156 12.7018 22.0924C12.722 22.0691 12.7465 22.0501 12.7741 22.0364L14.6474 21.0997C14.7029 21.072 14.7672 21.0674 14.8261 21.0871C14.885 21.1067 14.9337 21.1489 14.9615 21.2044C14.9753 21.2319 14.9835 21.2619 14.9857 21.2926C14.9879 21.3232 14.984 21.354 14.9743 21.3832C14.9646 21.4124 14.9492 21.4394 14.929 21.4626C14.9089 21.4859 14.8843 21.5049 14.8568 21.5186L12.9835 22.4553C12.951 22.4714 12.9153 22.4798 12.879 22.48ZM18.9671 20.1383C18.9364 20.1384 18.9059 20.1323 18.8775 20.1206C18.8491 20.1088 18.8232 20.0916 18.8015 20.0698C18.7797 20.0481 18.7625 20.0222 18.7507 19.9938C18.739 19.9654 18.7329 19.9349 18.733 19.9042V19.4358C18.733 19.3064 18.8377 19.2017 18.9671 19.2017C19.0966 19.2017 19.2013 19.3064 19.2013 19.4358V19.9042C19.2013 19.9349 19.1953 19.9654 19.1835 19.9938C19.1717 20.0222 19.1545 20.0481 19.1327 20.0698C19.111 20.0916 19.0852 20.1088 19.0568 20.1206C19.0283 20.1323 18.9979 20.1384 18.9671 20.1383Z"
        fill="#575757"
      />
      <path
        d="M17.0934 22.4801C17.0402 22.4803 16.9885 22.4622 16.947 22.4288C16.8987 22.3899 16.8677 22.3334 16.8608 22.2717C16.854 22.21 16.8718 22.1481 16.9105 22.0996L18.7838 19.7579C18.8647 19.6578 19.0125 19.6409 19.1131 19.7213C19.1614 19.7603 19.1924 19.8167 19.1993 19.8784C19.2061 19.9401 19.1883 20.0021 19.1497 20.0507L17.2764 22.3923C17.2544 22.4197 17.2265 22.4418 17.1949 22.457C17.1632 22.4722 17.1285 22.4801 17.0934 22.4801Z"
        fill="#575757"
      />
      <path
        d="M17.0939 22.4802C17.0575 22.4801 17.0217 22.4716 16.9891 22.4555L15.1158 21.5188C15.0883 21.5051 15.0638 21.486 15.0436 21.4628C15.0234 21.4396 15.0081 21.4126 14.9983 21.3834C14.9886 21.3542 14.9847 21.3234 14.9869 21.2927C14.9891 21.2621 14.9973 21.2321 15.0111 21.2046C15.0389 21.1491 15.0876 21.1069 15.1465 21.0872C15.2054 21.0676 15.2697 21.0721 15.3253 21.0999L17.1986 22.0366C17.3144 22.0941 17.3609 22.2351 17.3034 22.3507C17.2839 22.3896 17.254 22.4223 17.217 22.4452C17.18 22.4681 17.1374 22.4802 17.0939 22.4802Z"
        fill="#575757"
      />
      <path
        d="M16.1581 27.5773C16.0997 27.5773 16.0434 27.5555 16.0003 27.5161C15.9571 27.4768 15.9302 27.4228 15.9248 27.3647C15.9192 27.3029 15.9383 27.2414 15.9779 27.1937C16.0175 27.1459 16.0744 27.1158 16.1361 27.1099C21.9505 26.5661 26.5657 21.9504 27.1104 16.1356C27.1228 16.0066 27.2371 15.9115 27.3652 15.9242C27.3959 15.9271 27.4257 15.936 27.4529 15.9503C27.4801 15.9647 27.5043 15.9843 27.5239 16.008C27.5436 16.0317 27.5584 16.059 27.5675 16.0884C27.5766 16.1178 27.5798 16.1488 27.5769 16.1794C27.0112 22.2184 22.2181 27.0115 16.18 27.5764C16.1727 27.5768 16.1653 27.5773 16.1581 27.5773Z"
        fill="#575757"
      />
      <path
        d="M27.3414 14.0241C27.2832 14.0241 27.2271 14.0024 27.1839 13.9632C27.1408 13.9241 27.1138 13.8703 27.1082 13.8123C26.553 8.01144 21.9391 3.40694 16.1362 2.8636C16.1055 2.86074 16.0758 2.85187 16.0486 2.8375C16.0214 2.82313 15.9973 2.80355 15.9777 2.77987C15.9581 2.75619 15.9433 2.72888 15.9342 2.69949C15.9252 2.6701 15.922 2.63921 15.9249 2.60859C15.9367 2.47963 16.0525 2.3831 16.18 2.3971C22.2062 2.96147 26.998 7.74337 27.5747 13.7675C27.5777 13.8 27.574 13.8328 27.5636 13.8637C27.5533 13.8947 27.5366 13.9231 27.5147 13.9473C27.4927 13.9714 27.466 13.9907 27.4362 14.004C27.4063 14.0172 27.3741 14.0241 27.3414 14.0241Z"
        fill="#575757"
      />
      <path
        d="M2.63094 14.0506C2.59834 14.0506 2.56608 14.0438 2.53624 14.0306C2.50641 14.0175 2.47965 13.9982 2.45767 13.9742C2.4357 13.9501 2.41899 13.9217 2.40863 13.8907C2.39827 13.8598 2.39447 13.8271 2.39749 13.7946C2.96274 7.75588 7.75565 2.96249 13.7941 2.39701C13.9229 2.38354 14.037 2.47954 14.0492 2.60851C14.0549 2.67037 14.0358 2.73197 13.9961 2.77978C13.9565 2.82759 13.8995 2.85771 13.8376 2.86351C8.02325 3.40803 3.40803 8.02348 2.86399 13.8381C2.85854 13.8961 2.83164 13.9501 2.78855 13.9894C2.74545 14.0287 2.68926 14.0505 2.63094 14.0506Z"
        fill="#575757"
      />
      <path
        d="M13.8161 27.5775C13.8088 27.5775 13.8015 27.577 13.7942 27.5765C7.75591 27.0117 2.96299 22.2186 2.39751 16.1796C2.39463 16.1489 2.39782 16.118 2.40689 16.0886C2.41596 16.0592 2.43074 16.0319 2.45038 16.0082C2.47002 15.9845 2.49414 15.9649 2.52136 15.9505C2.54857 15.9361 2.57836 15.9273 2.609 15.9244C2.73434 15.9121 2.85183 16.0072 2.86401 16.1357C3.40829 21.9505 8.02351 26.5662 13.8376 27.11C13.8994 27.1159 13.9564 27.146 13.996 27.1937C14.0357 27.2415 14.0548 27.303 14.0492 27.3648C14.0438 27.4229 14.0169 27.4769 13.9738 27.5162C13.9307 27.5556 13.8745 27.5774 13.8161 27.5775Z"
        fill="#575757"
      />
      <path
        d="M28.7536 14.05C28.695 14.0499 28.6385 14.0278 28.5954 13.9881C28.5523 13.9483 28.5257 13.8939 28.5208 13.8354C27.9656 7.21587 22.758 2.00835 16.1383 1.45288C16.1076 1.4503 16.0778 1.44172 16.0505 1.42762C16.0232 1.41351 15.9989 1.39416 15.9791 1.37068C15.9592 1.34719 15.9442 1.32003 15.9349 1.29074C15.9255 1.26145 15.9221 1.23061 15.9247 1.19998C15.9272 1.16935 15.9358 1.13951 15.9499 1.1122C15.964 1.08488 15.9833 1.06061 16.0068 1.04077C16.0303 1.02094 16.0575 1.00593 16.0868 0.99661C16.1161 0.987286 16.1469 0.98383 16.1776 0.986439C23.0256 1.56088 28.4133 6.94809 28.9873 13.7961C28.9901 13.8285 28.9861 13.861 28.9756 13.8918C28.9652 13.9225 28.9484 13.9507 28.9264 13.9746C28.9044 13.9984 28.8777 14.0175 28.848 14.0305C28.8182 14.0434 28.7861 14.0501 28.7536 14.05Z"
        fill="#575757"
      />
      <path
        d="M13.8168 28.9874C13.8101 28.9874 13.8037 28.9874 13.7968 28.9865C6.94881 28.4121 1.56137 23.0253 0.987158 16.1772C0.984572 16.1466 0.988045 16.1158 0.997377 16.0865C1.00671 16.0572 1.02172 16.03 1.04155 16.0065C1.06138 15.9831 1.08564 15.9637 1.11295 15.9496C1.14025 15.9355 1.17007 15.9269 1.2007 15.9243C1.33494 15.9124 1.44312 16.0094 1.4536 16.1379C2.00883 22.7573 7.21635 27.9648 13.8361 28.52C13.898 28.5252 13.9553 28.5548 13.9953 28.6022C14.0354 28.6496 14.0549 28.711 14.0497 28.7729C14.0449 28.8314 14.0182 28.8859 13.9751 28.9256C13.9319 28.9654 13.8754 28.9874 13.8168 28.9874Z"
        fill="#575757"
      />
      <path
        d="M29.7398 15.221H25.0565C24.927 15.221 24.8223 15.1163 24.8223 14.9868C24.8223 14.8574 24.927 14.7527 25.0565 14.7527H29.7398C29.8693 14.7527 29.974 14.8574 29.974 14.9868C29.974 15.1163 29.8693 15.221 29.7398 15.221Z"
        fill="#575757"
      />
      <path
        d="M4.91755 15.221H0.234158C0.104721 15.221 0 15.1163 0 14.9868C0 14.8574 0.104721 14.7527 0.234158 14.7527H4.91749C5.04693 14.7527 5.15171 14.8574 5.15171 14.9868C5.15171 15.1163 5.04699 15.221 4.91755 15.221Z"
        fill="#575757"
      />
      <path
        d="M14.9861 29.9735C14.9554 29.9735 14.9249 29.9675 14.8965 29.9557C14.8681 29.9439 14.8422 29.9267 14.8205 29.905C14.7987 29.8832 14.7815 29.8574 14.7697 29.829C14.758 29.8005 14.7519 29.7701 14.752 29.7393V25.056C14.752 24.9265 14.8567 24.8218 14.9861 24.8218C15.1155 24.8218 15.2203 24.9265 15.2203 25.056V29.7393C15.2203 29.7701 15.2143 29.8005 15.2025 29.829C15.1907 29.8574 15.1735 29.8832 15.1517 29.905C15.13 29.9267 15.1042 29.9439 15.0757 29.9557C15.0473 29.9675 15.0169 29.9735 14.9861 29.9735Z"
        fill="#575757"
      />
      <path
        d="M14.9861 5.15171C14.9554 5.15172 14.9249 5.14567 14.8965 5.13391C14.8681 5.12214 14.8422 5.10489 14.8205 5.08314C14.7987 5.06138 14.7815 5.03556 14.7697 5.00713C14.758 4.97871 14.7519 4.94825 14.752 4.91749V0.234158C14.752 0.104721 14.8567 0 14.9861 0C15.1155 0 15.2203 0.104721 15.2203 0.234158V4.91749C15.2203 4.94825 15.2143 4.97871 15.2025 5.00713C15.1907 5.03556 15.1735 5.06138 15.1517 5.08314C15.13 5.10489 15.1042 5.12214 15.0758 5.13391C15.0473 5.14567 15.0169 5.15172 14.9861 5.15171Z"
        fill="#575757"
      />
    </svg>
  );
};

export default AvatarIcon;