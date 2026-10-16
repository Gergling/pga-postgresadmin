import { useCallback, useMemo, useState } from 'react';
import { getIsoDateTimeString } from '@/shared/utilities';

const useSvgBlobUrl = (element: SVGSVGElement | null) => {
  return useMemo(() => {
    if (!element) return { blobURL: null };

    // 1. Serialize the SVG element into a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(element);

    // 2. Create a Blob from the SVG string
    const svgBlob = new Blob(
      [svgString], { type: 'image/svg+xml;charset=utf-8' }
    );
    const blobURL = URL.createObjectURL(svgBlob);

    return { blobURL };
  }, [element]);
};

type HandleDownloadPngParams = {
  fileName?: string;
  targetHeight?: number;
  targetWidth?: number;
};

const useSvgPngDownloader = (
  svgElement: SVGSVGElement | null
) => {
  const { blobURL } = useSvgBlobUrl(svgElement);

  const [error, setError] = useState<{
    event?: Event;
    message: string;
  }>();

  const handleDownloadPNG = useCallback((
    params?: HandleDownloadPngParams
  ) => {
    if (!svgElement || !blobURL) return;

    const {
      fileName, targetHeight, targetWidth
    } = Object.assign({
      fileName: `png-${getIsoDateTimeString()}.png`,
      targetWidth: svgElement.clientWidth || 500,
      targetHeight: svgElement.clientHeight || 500,
    }, params);

    console.log('size', targetHeight, targetWidth)

    const image = new Image();

    image.onerror = (
      err
    ) => {
      if (typeof err === 'string') {
        return setError({ message: `Image failed to load: ${err}` });
      }
      setError({ event: err, message: 'Image failed to load' });
    }

    image.onload = () => {
      // 3. Create an off-screen canvas matching the SVG dimensions
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      setError(undefined);

      const context = canvas.getContext('2d');
      if (!context) return setError({ message: 'Canvas context not found' });

      // 4. Draw the image onto the canvas
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      // 5. Export canvas as a PNG and trigger download
      const pngURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngURL;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobURL);
    };

    image.src = blobURL;
  }, [blobURL, svgElement]);

  return {
    error,
    handleDownloadPNG,
  };
}

export const useSvgDownloader = (
  originalElement: SVGSVGElement | null = null
) => {
  const element = originalElement
    ? originalElement.cloneNode(true) as SVGSVGElement
    : null;
  const { blobURL } = useSvgBlobUrl(element);

  const handleDownloadSVG = useCallback((
    fileName = `svg-${getIsoDateTimeString()}.svg`
  ) => {
    if (!blobURL) return;

    const downloadLink = document.createElement('a');
    downloadLink.href = blobURL;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobURL);
  }, [blobURL]);

  const { error: errorPNG, handleDownloadPNG } = useSvgPngDownloader(element);

  return {
    errorPNG,
    handleDownloadSVG,
    handleDownloadPNG,
  };
};
