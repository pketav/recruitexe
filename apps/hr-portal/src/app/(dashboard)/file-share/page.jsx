'use client';

import React, { useEffect, useState } from 'react';
import Explorer from './file-share/Explorer';

const FileShareHO = ({ mode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return <Explorer />;
};

export default FileShareHO;