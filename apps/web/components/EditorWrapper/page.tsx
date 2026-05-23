
"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import type { IJodit } from "jodit/esm/types/jodit";
import type { JoditEditorProps } from "jodit-react/build/types/JoditEditor";
// import "jodit/build/jodit.min.css";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

type EditorWrapperProps = JoditEditorProps

const EditorWrapper = forwardRef<IJodit, EditorWrapperProps>((props, ref) => {
  return <JoditEditor {...props} ref={ref} />;
});

EditorWrapper.displayName = "EditorWrapper";

export default EditorWrapper;
