import { getObjectEntries } from "@/shared/utilities";
import { TrendingDown, TrendingFlat, TrendingUp } from "@mui/icons-material";
import { createElement } from "react";
import { SEMANTIC_NAMES_MESSAGE } from "@gergling/ui-components";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type BaseItem = {
  fn?: (value: number) => boolean;
  icon: OverridableComponent<SvgIconTypeMap>;
  color: typeof SEMANTIC_NAMES_MESSAGE[number];
  sign: string;
};
type ConfigItem = Omit<BaseItem, 'icon'> & { icon: React.ReactNode; };
type Base = Record<string, BaseItem>;
type Config<T extends Base> = {
  [K in keyof T]: ConfigItem & { key: K; };
};
type Item<T extends Base> = ConfigItem & { key: keyof T; };

const createConfig = <T extends Base>(config: T) => {
  const x = getObjectEntries(config).reduce((acc, [key, value]) => {
    const item: Item<T> = { ...value, icon: createElement(value.icon, { color: value.color }), key };
    return {
      config: {
        ...acc.config,
        [key]: item,
      },
      items: [...acc.items, item],
    };
  }, {
    config: {} as Config<T>,
    items: []
  } as {
    config: Config<T>;
    items: Item<T>[];
  });

  return x;
};

export const {
  config: DELTA_CONFIG,
  items: DELTA_CONFIG_LIST
} = createConfig({
  '+': {
    color: 'success',
    fn: (value) => value > 0,
    icon: TrendingUp,
    sign: '+',
  },
  '-': {
    color: 'error',
    fn: (value) => value < 0,
    icon: TrendingDown,
    sign: '-',
  },
  '0': {
    color: 'warning',
    icon: TrendingFlat,
    sign: '',
  },
});
