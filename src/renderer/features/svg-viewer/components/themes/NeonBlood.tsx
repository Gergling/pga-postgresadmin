import {
  PropsWithChildren, useCallback, useEffect, useMemo, useState
} from "react";
import { Download } from "@mui/icons-material";
import {
  NEON_PLASMA_GLOW_CONFIG,
  NeonPlasmaGlowConfigNames,
  SizeName
} from "../../config/neon";
import { useSize, useUniqueId } from "../../hooks";
import { getPlasmaGlowLayers, getSvgFilter } from "./neon";
import { getGeometryGroup } from "./utilities";
import {
  Dropdown,
  DropdownActionOption,
  useElementMouseEvents,
  useSvgDownloader
} from "@/renderer/shared/common";
import { neonGlowStyle } from "@/renderer/shared/theme";

const fixViewBox = (clonedSvg: SVGSVGElement) => {
  const viewBoxStr = clonedSvg.getAttribute("viewBox");

  // If there's no viewBox, we don't need to do anything about it.
  if (!viewBoxStr) return;

  const [minX, minY, vbWidth, vbHeight] = viewBoxStr
    .split(/[\s,]+/)
    .map(parseFloat);

  // If both are equal to 0, we don't need to bother with this.
  if (minX === 0 && minY === 0) return;

  // Create a native wrapper grouping element
  const wrapperGroup = document.createElementNS(
    "http://www.w3.org/2000/svg", "g"
  );

  // Apply an inverse transform to reposition the inner coordinates perfectly to 0,0
  wrapperGroup.setAttribute("transform", `translate(${-minX}, ${-minY})`);

  // Move all original SVG child elements (except defs/styles if you want to be safe) 
  // into the new transform group container
  while (clonedSvg.firstChild) {
    wrapperGroup.appendChild(clonedSvg.firstChild);
  }

  // Append the transformed group back into the root clone element
  clonedSvg.appendChild(wrapperGroup);

  // Reset the cloned viewBox to start exactly at 0,0
  clonedSvg.setAttribute(
    "viewBox", `${minX / 2} ${minY / 2} ${vbWidth} ${vbHeight}`
  );
};

const useNeonBloodSvgDownloader = (
  { width, height }: { width: number; height: number; }
) => {
  const [svgNode, setSvgNode] = useState<SVGSVGElement | null>(null);
  const { isInside, props } = useElementMouseEvents<SVGSVGElement>(svgNode);
  const refCallback = useCallback((node: SVGSVGElement | null) => {
    // A) Keep your hook's internal useRef pipeline populated
    props.ref.current = node;
    // B) Update state to trigger an asynchronous layout re-render pass
    if (svgNode !== node) {
      setSvgNode(node);
    }
  }, [props.ref, svgNode]);
  const element = useMemo(() => {
    const clone = svgNode?.cloneNode(true) as SVGSVGElement;
    if (!clone || !svgNode) return null;
    fixViewBox(clone);
    clone.setAttribute("width", width.toString());
    clone.setAttribute("height", height.toString());
    return clone;
  }, [svgNode]);

  return { element, isInside, props, refCallback };
};

const DownloadIcon = () => <Download
  color={'primary'} {...neonGlowStyle({ shadow: { box: true } })}
/>

export type SvgNeonProps = PropsWithChildren & {
  color?: NeonPlasmaGlowConfigNames;
  showDownload?: boolean;
  size?: SizeName;
};

const SvgDownloader = (
  {
    refElement, targetWidth, targetHeight
  }: {
    refElement: SVGSVGElement | null;
    targetWidth: number;
    targetHeight: number;
  }
) => {
  const {
    errorPNG,
    handleDownloadPNG, handleDownloadSVG
  } = useSvgDownloader(refElement);

  const options = useMemo(
    (): DropdownActionOption[] => [
      {
        label: 'png', onClick: () => handleDownloadPNG({
          targetWidth, targetHeight
        })
      },
      { label: 'svg', onClick: handleDownloadSVG }
    ].map((option, value) => ({
      label: option.label.toUpperCase(),
      onClick: () => option.onClick(),
      value,
    })),
    [handleDownloadPNG, handleDownloadSVG, refElement]
  );

  useEffect(() => { if (errorPNG) console.error(errorPNG); }, [errorPNG]);

  return <Dropdown
    icon={<DownloadIcon />}
    iconButtonProps={{ style: { padding: 0 } }}
    options={options}
    showSelectedText={false}
  />;
};

export const SvgNeonBlood = ({
  children,
  color = 'blood',
  showDownload = false,
  size = 'large',
}: SvgNeonProps) => {
  const {
    plasmaGlowId,
    runeGeometryId,
  } = useUniqueId(['plasmaGlowId', 'runeGeometryId']);

  const {
    translation,
    container,
    offset,
    ...svgProps
  } = useSize(size);

  const {
    element, isInside, props, refCallback
  } = useNeonBloodSvgDownloader(container);
  const downloaderMouseEvents = useElementMouseEvents<HTMLDivElement>();

  return <div style={{
    position: 'relative',
    ...container
  }}>
    <svg
      version="1.1" xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
      {...props}
      ref={refCallback}
      style={{
        position: 'absolute',
        // background: '#200',
        ...offset,
      }}
    >
      <defs>
        {getSvgFilter(plasmaGlowId)}
      </defs>

      {getGeometryGroup(runeGeometryId, translation, children)}

      {getPlasmaGlowLayers(
        runeGeometryId, plasmaGlowId, NEON_PLASMA_GLOW_CONFIG[color]
      )}
    </svg>
    {showDownload && <div {...downloaderMouseEvents.props}
      ref={downloaderMouseEvents.props.ref}
      style={{
        bottom: 0,
        opacity: isInside || downloaderMouseEvents.isInside ? 1 : 0,
        position: 'absolute',
        right: 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <SvgDownloader
        refElement={element}
        targetHeight={container.height}
        targetWidth={container.width}
      />
    </div>}
  </div>;
};
