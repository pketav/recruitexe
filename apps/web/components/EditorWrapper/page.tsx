
"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
// import "jodit/build/jodit.min.css";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

type EditorWrapperProps = Record<string, unknown>

const EditorWrapper = forwardRef<unknown, EditorWrapperProps>((props, ref) => {
  return <JoditEditor {...props} ref={ref} />;
});

EditorWrapper.displayName = "EditorWrapper";

export default EditorWrapper;
