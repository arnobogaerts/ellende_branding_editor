declare module 'dom-to-image-more' {
  export interface DomToImageOptions {
    width?: number;
    height?: number;
    style?: Partial<Record<keyof CSSStyleDeclaration | string, string | number | null>>;
    quality?: number;
    imagePlaceholder?: string;
    cacheBust?: boolean;
    bgcolor?: string;
    filter?: (node: Node) => boolean;
  }

  interface DomToImage {
    toPng(node: Node, options?: DomToImageOptions): Promise<string>;
    toBlob(node: Node, options?: DomToImageOptions): Promise<Blob>;
    toJpeg(node: Node, options?: DomToImageOptions): Promise<string>;
    toSvg(node: Node, options?: DomToImageOptions): Promise<string>;
    toPixelData(node: Node, options?: DomToImageOptions): Promise<Uint8ClampedArray>;
  }

  const domtoimage: DomToImage;
  export default domtoimage;
}
