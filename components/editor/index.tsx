/* eslint-disable react-hooks/exhaustive-deps */
import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import type { OutputData } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import Link from "@editorjs/link";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import SimpleImage from "@editorjs/simple-image";
import type { FunctionComponent } from "react";
import { useEffect, useRef } from "react";

const EDITTOR_HOLDER_ID = "editorjs";

interface IProps {
  data: OutputData;
  onChange: (data: OutputData) => void;
  readOnly?: boolean;
}

const Editor: FunctionComponent<IProps> = ({ data, onChange, readOnly }) => {
  const ejInstance = useRef<EditorJS>();
  // const [editorData, setEditorData] = useState<OutputData>(data);

  const initEditor = () => {
    const editor = new EditorJS({
      readOnly,
      inlineToolbar: true,
      sanitizer: {},
      placeholder: "Start here...",
      minHeight: 320,
      holder: EDITTOR_HOLDER_ID,
      data,
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async () => {
        const content = await ejInstance.current.saver.save();
        // Put your logic here to save this data to your DB

        onChange(content);
      },
      autofocus: false,
      tools: {
        code: Code,
        header: {
          class: Header,
          config: {
            placeholder: "Enter a Header",
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        paragraph: { class: Paragraph },
        checklist: CheckList,
        embed: Embed,
        image: Image,
        inlineCode: InlineCode,
        link: Link,
        list: List,
        quote: Quote,
        simpleImage: SimpleImage,
        delimiter: Delimiter,
      },
    });
  };

  // This will run only once
  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      ejInstance.current.destroy();
      ejInstance.current = null;
    };
  }, []);

  return (
    <div
      className="overflow-auto max-h-80 p-2 border border-gray-200"
      id={EDITTOR_HOLDER_ID}
    ></div>
  );
};

export default Editor;
