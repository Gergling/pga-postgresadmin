import { Skeleton, SkeletonProps } from "@mui/material";

export const NavigationLoadingHistoryIcon = (
  props: SkeletonProps
) => <Skeleton variant='circular' width={24} height={24} {...props} />;

export const NavigationLoadingHistoryText = (
  props: SkeletonProps
) => <Skeleton variant='text' height={24} {...props} />;
