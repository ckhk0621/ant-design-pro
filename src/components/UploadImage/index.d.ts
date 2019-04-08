import React from 'react';
import { DropDownProps } from 'antd/lib/dropdown';

declare type OverlayFunc = () => React.ReactNode;

export interface UploadImageProps extends DropDownProps {
  overlay: React.ReactNode | OverlayFunc;
  clear: boolean;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}

export default class UploadImage extends React.Component<UploadImageProps, any> {}
