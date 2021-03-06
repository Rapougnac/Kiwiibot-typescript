import type {
  CanvasRenderingContext2D,
  Image,
  NodeCanvasRenderingContext2D,
} from 'canvas';
import type { Readable } from 'stream';
import type { centerImageOutput } from './interfaces/main';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Canvas {
  /**
   * Add a greyscale effect to the canvas
   * @param ctx The context of the canvas
   * @param x The x axis
   * @param y The y axis
   * @param width The width of the image
   * @param height The height of the image
   * @returns The context of the canvas
   */
  public static greyscale(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): CanvasRenderingContext2D {
    const data = ctx.getImageData(x, y, width, height);

    for (let i = 0; i < data.data.length; i += 4) {
      const brightness =
        0.34 * (data.data[i] ?? 0) +
        0.5 * (data.data[i + 1] ?? 0) +
        0.16 * (data.data[i + 2] ?? 0);

      data.data[i] = brightness;
      data.data[i + 1] = brightness;
      data.data[i + 2] = brightness;
    }
    ctx.putImageData(data, x, y);

    return ctx;
  }
  /**
   * Add an effect fisheye to the canvas
   * @param ctx The canvas context
   * @param level The level of intensity
   * @param x The x axis
   * @param y The y axis
   * @param width The width of the image
   * @param height The height of the image
   */
  public static fishEye(
    ctx: CanvasRenderingContext2D,
    level: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): CanvasRenderingContext2D {
    const frame = ctx.getImageData(x, y, width, height);
    const source = new Uint8Array(frame.data);
    for (let i = 0; i < frame.data.length; i += 4) {
      const sy = Math.floor(i / 4 / frame.width);
      const sx = (i / 4) % frame.width;
      const dx = Math.floor(frame.width / 2) - sx;
      const dy = Math.floor(frame.height / 2) - sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const x2 = Math.round(
        frame.width / 2 - (dx - Math.sin(dist / (level * Math.PI) / 2))
      );
      const y2 = Math.round(
        frame.height / 2 - dy * Math.sin(dist / (level * Math.PI) / 2)
      );
      const i2 = (y2 * frame.width + x2) * 4;
      frame.data[i] = source[i2] ?? 0;
      frame.data[i + 1] = source[i2 + 1] ?? 0;
      frame.data[i + 2] = source[i2 + 2] ?? 0;
      frame.data[i + 3] = source[i2 + 3] ?? 0;
    }
    ctx.putImageData(frame, x, y);
    return ctx;
  }
  /**
   * Draw an image with a specified color tint
   * @param ctx The canvas context
   * @param image The image
   * @param color The color to add to
   * @param x The x axis
   * @param y The y axis
   * @param width The width parameter
   * @param height The height parameter
   */
  public static drawImageWithTint(
    ctx: NodeCanvasRenderingContext2D,
    image: Image,
    color: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): CanvasRenderingContext2D {
    const { fillStyle, globalAlpha } = ctx;
    ctx.fillStyle = color;
    ctx.drawImage(image, x, y, width, height);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = globalAlpha;
    return ctx;
  }
  /**
   * Center an image
   * @param base The base to pass in
   * @param data The data to pass in
   */
  public static centerImage(base: Image, data: Image): centerImageOutput {
    const dataRatio = data.width / data.height;
    const baseRatio = base.width / base.height;
    let { width, height } = data;
    let x = 0;
    let y = 0;
    if (baseRatio < dataRatio) {
      height = data.height;
      width = base.width * (height / base.height);
      x = (data.width - width) / 2;
      y = 0;
    } else if (baseRatio > dataRatio) {
      width = data.width;
      height = base.height * (width / base.width);
      x = 0;
      y = (data.height - height) / 2;
    }
    return { x, y, width, height };
  }
  /**
   * Wrap a text in an image
   * @param ctx The canvas context
   * @param text The text to add to
   * @param maxWidth The max width of the text
   */
  public static wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): Promise<string[] | null> {
    return new Promise((resolve) => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText('W').width > maxWidth) return resolve(null);
      const words = text.split(' ');
      const lines: string[] = [];
      let line = '';
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0] as string).width >= maxWidth) {
          const temp = words[0];
          if (!temp) break;
          words[0] = temp.slice(0, -1);
          if (split) {
            words[1] = `${temp.slice(-1)}${words[1]}`;
          } else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
          line += `${words.shift()} `;
        } else {
          lines.push(line.trim());
          line = '';
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  }
  /**
   * Resolve a stream to get in array
   * @param stream The stream to resolve
   */
  public static streamToArray(
    stream: Readable
  ): Promise<Uint8Array[] | never[]> {
    if (!stream.readable) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      const arr: Uint8Array[] = [];
      const onData = (data: Uint8Array) => {
        arr.push(data);
      };
      const onEnd = (err?: Error) => {
        if (err) reject(err);
        else resolve(arr);
        cleanUp();
      };
      const onClose = () => {
        resolve(arr);
        cleanUp();
      };
      const cleanUp = () => {
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onEnd);
        stream.removeListener('close', onClose);
      };
      stream.on('data', onData);
      stream.on('end', onEnd);
      stream.on('error', onEnd);
      stream.on('close', onClose);
    });
  }

  /**
   * Draws a rounded rectangle using the current state of the canvas.
   * If you omit the last three params, it will draw a rectangle
   * outline with a 5 pixel border radius.
   * @param ctx The context of the canvas
   * @param x The top left x coordinate
   * @param y The top left y coordinate
   * @param width The width of the rectangle
   * @param height The height of the rectangle
   * @param radius The corner radius; It can also be an object with the radius specified for each corner.
   * @param fill Whether to fill the rectangle
   * @param stroke Whether to stroke the rectangle
   */
  public static roundRectangle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number | RadiusOptions = 5,
    fill = false,
    stroke = false
  ) {
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    }
    radius.tl ??= 0;
    radius.tr ??= 0;
    radius.br ??= 0;
    radius.bl ??= 0;
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }
  }

  /**
   * Wrap a text to a certain width and add a new line if needed
   * @param ctx The context of the canvas
   * @param text The text to wrap
   * @param x The x coordinate of the text
   * @param y The y coordinate of the text
   * @param lineHeight The line height of the text
   * @param fitWidth The maximum width of the text
   */
  public static wordWrap(
    ctx: NodeCanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    lineHeight: number,
    fitWidth: number
  ) {
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0) {
      ctx.fillText(text, x, y);
      return;
    }

    let words = text.split(/(?:\s+)/g);
    let currentLine = 0;
    let idx = 1;
    while (words.length > 0 && idx <= words.length) {
      const str = words.slice(0, idx).join(' ');
      const w = ctx.measureText(str).width;
      if (w > fitWidth) {
        if (idx === 1) {
          idx = 2;
        }
        ctx.fillText(
          words.slice(0, idx - 1).join(' '),
          x,
          y + lineHeight * currentLine
        );
        currentLine++;
        words = words.splice(idx - 1);
        idx = 1;
      } else {
        idx++;
      }
    }
    if (idx > 0) ctx.fillText(words.join(' '), x, y + lineHeight * currentLine);
  }

  public static wrap(
    ctx: NodeCanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    lineHeight: number,
    fitWidth: number
  ) {
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0) {
      ctx.fillText(text, x, y);
      return;
    }

    for (let idx = 1; idx <= text.length; idx++) {
      const str = text.substring(0, idx);
      if (ctx.measureText(str).width > fitWidth) {
        ctx.fillText(text.substring(0, idx - 1), x, y);
        Canvas.wrap(
          ctx,
          text.substring(idx - 1),
          x,
          y + lineHeight,
          lineHeight,
          fitWidth
        );
        return;
      }
    }
    ctx.fillText(text, x, y);
  }
}
/**
 * Different radius for corners of a rectangle. Can be used to draw rounded corners.
 * Can be an object with the radius specified for each corner.
 */
interface RadiusOptions {
  /** The top left */
  tl?: number;
  /** The top right */
  tr?: number;
  /** The bottom left */
  br?: number;
  /** The bottom right */
  bl?: number;
}
