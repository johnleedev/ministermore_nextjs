'use client';

import React from 'react';

interface TitleProps {
  width : string;
  height : string;
  backGroundColor: string;
}

export default function Divider( props: TitleProps ) {
  return (
    <div style={{
      width: props.width,
      height: props.height,
      backgroundColor: props.backGroundColor
    }}>
    </div>
  );
}

