  /** sharpColorOptions */

/**
 * Color filter
 * 
 * Example: {
 * 
 * tint: {
    r: 255;
    g: 255;
    b: 255;
  },

  grayscale: true,

  toColourspace: 'b-w',

 * }
 */
export interface sharpColorOptions {
    /**
     * Tint the image using the provided chroma while preserving the image luminance.
     * 
     * Values: red, green and blue. The values must be over 0 and under 255
     * 
     * Ex:
     * tint: {
      r: 255;
      g: 255;
      b: 255;
    };
  *
    * For more info please visit: https://sharp.pixelplumbing.com/api-colour#tint
     */
    //activateSharpColorFilter: boolean;
    tint?: {
      r: number;
      g: number;
      b: number;
    };
  
    /**
     * Convert to 8-bit greyscale.
     *
     * Value: true, by default is false
     *
     * For more info please visit:
     * https://sharp.pixelplumbing.com/api-colour#grayscale
     */
    grayscale?: true;
  
      /**
     * The input image will be converted to the provided colourspace at the start of the pipeline. All operations will use this colourspace before converting to the output colourspace.
     *
     * For more info please visit:
     * https://sharp.pixelplumbing.com/api-colour#pipelinecolourspace
     */
    pipelineColourspace?:
      | 'multiband'
      | 'b-w'
      | 'histogram'
      | 'xyz'
      | 'lab'
      | 'cmyk'
      | 'labq'
      | 'rgb'
      | 'cmc'
      | 'lch'
      | 'labs'
      | 'srgb'
      | 'yxy'
      | 'fourier'
      | 'rgb16'
      | 'grey16'
      | 'matrix'
      | 'scrgb'
      | 'hsv'
      | 'last';
  
      /**
       * Set the output colourspace. By default output image will be web-friendly sRGB, with additional channels interpreted as alpha channels.
       * 
       * For more info please visit: https://sharp.pixelplumbing.com/api-colour#tocolourspace
       */
    toColourspace?:
      | 'multiband'
      | 'b-w'
      | 'histogram'
      | 'xyz'
      | 'lab'
      | 'cmyk'
      | 'labq'
      | 'rgb'
      | 'cmc'
      | 'lch'
      | 'labs'
      | 'srgb'
      | 'yxy'
      | 'fourier'
      | 'rgb16'
      | 'grey16'
      | 'matrix'
      | 'scrgb'
      | 'hsv'
      | 'last';
  }

  /** sharpChannelOptions */


/**
 * These are the options for manipulating the image channel. 
 * 
 * removeAlpha -> Optional -> Remove Alpha Channel -> Value: true, false by default
 * ensureAlpha -> Optional -> Create Alpha Channel -> Value: 0 or 1
 * extractChannel -> Optional -> Extract a single channel -> Value: red, green or blue
 */
export interface sharpChannelOptions {
    //activatesharpChannelFilter: boolean;
    /**
     * Remove alpha channel, if any. 
     * 
     * For more info please visit: https://sharp.pixelplumbing.com/api-channel#removealpha
     */
    removeAlpha?: true;
  
    /**
     * Ensure the output image has an alpha transparency channel. If missing, the added alpha channel will have the specified transparency level.
     * 
     * For more info, please visit: https://sharp.pixelplumbing.com/api-channel#ensurealpha
     */
    ensureAlpha?: 0 | 1;
  
    /**
     * Extract a single channel from a multi-channel image.
     * 
     * For more infor, please visit: https://sharp.pixelplumbing.com/api-channel#extractchannel
     */
    extractChannel?: 'green' | 'red' | 'blue' | 'alpha';
    //   bandbool?: 'and' | 'or' | 'eor';
  }

  /** sharpImageOptions */


/**
 * These are the main option for the output image. 
 * 
 * In general, you should note that if you use width and height, they will take precedence over squareSize. 
 * 
 * heigth -> Optional -> Default: real image heigth -> Value: over 0
 * 
 * width -> Optional -> Default: real image width -> Value: over 0
 * 
 * outPutFormat -> Optional -> Default: webp -> Why? Less data needs to be transferred  
 * 
 * quality -> Optional -> Default: 80 -> Doesn't work well with png -> Value: over 0
 * 
 * fit -> Optional -> Defalut: cover -> Crop the image to fit size 
 * 
 * adaptiveFiltering -> Optional -> Dafault: false -> Only works with PNG
 * 
 * Example: {
 * width: 500,
 * 
 * height: 600,
 * 
 * outPutFormat: "jpeg",
 * 
 * quality: 70,
 * 
 * squareSize: 800, -> It won't work in this case
 * 
 * adaptiveFiltering: true -> It won't work in this case
 * }
 * 
 * For more info please visit: https://sharp.pixelplumbing.com/api-output
 */
export interface sharpImageOptions {

    /**
     * Final image heigth 
     * 
     * Value ovewr 0 please
     */
  heigth?: number;
  /**
   * Final image width
   * 
   * Value over 0 please
   */
  width?: number;

  /**
   * Final image format
   * 
   */
  outPutFormat?:
    | 'jpeg'
    | 'png'
    | 'webp'
    //| 'gif'
    | 'jpg'
    | 'tiff'
    // | 'avif'
    //| 'heic'
    //| 'heif'
    | 'raw';
  //| 'tile';

  /**
   * Final image quality
   * 
   * Value over 0 please
   */
  quality?: number;

    /**
   * Final image width and height -> both the same size
   * 
   * Value over 0 please
   */
  squareSize?: number;
  //cover, contain, fill, inside or outside
  /**
   * Final image "croping"
   */
  fit?: 'cover' | 'contain' | 'fill' | 'insede' | 'outside';

  /**
   * PNG compression filter
   */
  adaptiveFiltering?: boolean;
}

/** sharpImageOperations */

/**
 * Image Filters 
 * 
 * For more info please visit: https://sharp.pixelplumbing.com/api-operation
 */
export interface sharpImageOperations {
    /** Activates or deactivates the sharpImageOperations function
     *
     * Values: true or false
     */
    //applyImageOperations: boolean;
  
    /** Rotate the image
     *
     * If an angle is provided, it is converted to a valid positive degree rotation. For example, -450 will produce a 270deg rotation.
     *
     * Value: Number
     */
    rotate?: number;
  
    /** Flip the image about the vertical Y axis.
     *
     * Value: true or false
     */
    flip?: true; // Flip by Y
  
    /** Flip the image about the horizontal X axis.
     *
     * Value: true or false
     */
    flop?: true; // Flip by X
  
    /** Blur the image.
     *
     *  When used without parameters, performs a fast, mild blur of the output image.
     *
     *  Value between 0.3 and 1000
     */
    blur?: number; // > 0.3 - 100000
  
    /**
     * Sharpen the image. 
     * 
     * Values: {sigma, flat?, jagged?}
     */
    sharpen?: {
      sigma;
      flat?;
      jagged?;
    };
  
    /**
     * Apply median filter. 
     * 
     * Value: Size of median -> number
     */
    median?: number;
  
    /**
     * Apply a gamma correction by reducing the encoding (darken) pre-resize at a factor of 1/gamma then increasing the encoding (brighten) post-resize at a factor of gamma. 
     * 
     * Value {
     * 
     * gamma -> Values between 1.0 and 3.0
     * 
     * gammaOut -> Values between 1.0 and 3.0
     * 
     * }
     */
    gamma?: {
      gamma: number; // 1.0 - 3.0
      gammaOut?: number; // 1.0 - 3.0
    };
  /**
   * Produce the "negative" of the image.
   * 
   * Value: true, false by default
   */
    negate?: true;
  
  /**
   * Enhance output image contrast by stretching its luminance to cover the full dynamic range.
   * 
   * Value: true, false by default
   */
    normalise?: true;
  
    /**
     * Convolve the image with the specified kernel.
     * 
     * Values: {
     * 
     * width -> width of the kernel in pixels.
     * 
     * heigth ->  height of the kernel in pixels.
     * 
     * kernel -> Array of length width*height containing the kernel values.
     * 
     * scale -> Optional -> The scale of the kernel in pixels
     * 
     * offset -> Optional -> The offset of the kernel in pixels.
     * 
     * }
     */
    convolve?: {
      width: number;
      height: number;
      kernel: number[]; // width x height length
      scale?: number;
      offset?: number;
    };
  
  /**Any pixel value greater than or equal to the threshold value will be set to 255, otherwise it will be set to 0.
   * 
   * Value: {
   * 
   * treshold -> a value in the range 0-255 representing the level at which the threshold will be applied.
   * 
   * Options: -> Optional
   * 
   * {
   * greyScale -> convert to single channel greyscale. 
   * }
   * 
   * }
   */
    threshold?: {
      threshold: number;
      options?: {
        greyscale: boolean;
      };
    };
  
    /**
     * Apply the linear formula a * input + b to the image (levels adjustment)
     * 
     * Values: {
     * multiplier -> Optional -> a
     * offset -> Optional -> b
     * }
     */
    linear?: {
      multiplier?: number;
      offset?: number;
    };
  
    /**
     * Recomb the image with the specified matrix.
     * 
     * Matrix 3X3
     * 
     * Example:
     * 
     * [0.3588, 0.7044, 0.1368],
     * 
     * [0.2990, 0.5870, 0.1140],
     *
     * [0.2392, 0.4696, 0.0912],
     */
    recomb?: [
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ];
  
  /**
   * Transforms the image using brightness, saturation, hue rotation, and lightness. Brightness and lightness both operate on luminance, with the difference being that brightness is multiplicative whereas lightness is additive.
   */
    modulate?: {
      brightness?: number; // increase brightness by a factor of 2
      saturation?: number;
      hue?: number;
      lightness?: number;
    };
  }