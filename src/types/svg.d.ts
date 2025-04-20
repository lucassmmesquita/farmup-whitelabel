// src/types/svg.d.ts
declare module 'react-native-svg' {
    import React from 'react';
    import { ViewProps } from 'react-native';
    
    export interface SvgProps extends ViewProps {
      width?: number | string;
      height?: number | string;
      viewBox?: string;
      preserveAspectRatio?: string;
      opacity?: number | string;
      onLayout?: () => void;
      xmlns?: string;
      xmlnsXlink?: string;
    }
    
    export interface PathProps {
      d: string;
      fill?: string;
      fillOpacity?: number | string;
      fillRule?: 'nonzero' | 'evenodd';
      stroke?: string;
      strokeWidth?: number | string;
      strokeOpacity?: number | string;
      strokeLinecap?: 'butt' | 'round' | 'square';
      strokeLinejoin?: 'miter' | 'round' | 'bevel';
      strokeMiterlimit?: number | string;
      strokeDasharray?: Array<number> | string;
      strokeDashoffset?: number | string;
      transform?: string;
      origin?: string;
      originX?: number | string;
      originY?: number | string;
      onPress?: () => void;
    }
    
    export interface RectProps {
      x?: number | string;
      y?: number | string;
      width?: number | string;
      height?: number | string;
      rx?: number | string;
      ry?: number | string;
      fill?: string;
      fillOpacity?: number | string;
      stroke?: string;
      strokeWidth?: number | string;
      strokeOpacity?: number | string;
      transform?: string;
      onPress?: () => void;
    }
    
    export interface CircleProps {
      cx?: number | string;
      cy?: number | string;
      r?: number | string;
      fill?: string;
      fillOpacity?: number | string;
      stroke?: string;
      strokeWidth?: number | string;
      strokeOpacity?: number | string;
      transform?: string;
      origin?: string;
      originX?: number | string;
      originY?: number | string;
      onPress?: () => void;
    }
    
    export interface LineProps {
      x1?: number | string;
      y1?: number | string;
      x2?: number | string;
      y2?: number | string;
      fill?: string;
      fillOpacity?: number | string;
      stroke?: string;
      strokeWidth?: number | string;
      strokeOpacity?: number | string;
      strokeDasharray?: Array<number> | string;
      strokeDashoffset?: number | string;
      transform?: string;
      origin?: string;
      originX?: number | string;
      originY?: number | string;
      onPress?: () => void;
    }
    
    export interface TextProps {
      x?: number | string;
      y?: number | string;
      dx?: number | string;
      dy?: number | string;
      textAnchor?: 'start' | 'middle' | 'end';
      fill?: string;
      fillOpacity?: number | string;
      stroke?: string;
      strokeWidth?: number | string;
      strokeOpacity?: number | string;
      fontSize?: number | string;
      fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
      fontFamily?: string;
      transform?: string;
      origin?: string;
      originX?: number | string;
      originY?: number | string;
      alignmentBaseline?: 'baseline' | 'top' | 'hanging' | 'middle' | 'central' | 'bottom' | 'text-bottom' | 'text-top' | 'before-edge' | 'after-edge' | 'ideographic' | 'alphabetic' | 'mathematical';
      onPress?: () => void;
    }
    
    export interface GProps {
      transform?: string;
      origin?: string;
      originX?: number | string;
      originY?: number | string;
      onPress?: () => void;
    }
    
    export class Svg extends React.Component<SvgProps> {}
    export class Path extends React.Component<PathProps> {}
    export class Rect extends React.Component<RectProps> {}
    export class Circle extends React.Component<CircleProps> {}
    export class Line extends React.Component<LineProps> {}
    export class Text extends React.Component<TextProps> {}
    export class G extends React.Component<GProps> {}
    
    export default Svg;
  }