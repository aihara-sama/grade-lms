import AvatarIcon from "@/components/icons/avatar-icon";
import CameraIcon from "@/components/icons/camera-icon";
import { useEffect, useState, type FunctionComponent } from "react";

interface IProps {
  onChange: (url: string) => void;
}

const AvatarUpload: FunctionComponent<IProps> = ({ onChange }) => {
  const [url] = useState();

  useEffect(() => {
    if (url) {
      onChange(url);
    }
  }, [url]);

  return (
    <div className="flex justify-center mx-[0] my-[41px]">
      {url && <img alt="avatar" src={url} />}
      {!url && (
        <div className="flex relative">
          <AvatarIcon size="xl" />
          <div className="flex cursor-pointer absolute bottom-[2px] right-[12px] p-[10px] rounded-[50%] border border-3 border-white bg-gray-100 shadow-md hover:bg-gray-200 active:bg-gray-500">
            <CameraIcon size="sm" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
