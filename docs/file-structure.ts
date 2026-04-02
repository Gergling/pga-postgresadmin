type FileStructureRuleConfig = {
  name: string;
  children: FileStructureRuleConfig[];
} | string;

const createFileStructureRules = (
  config: FileStructureRuleConfig[]
): string[] => {
  const rules: string[] = [];

  config.forEach((configRule) => {
    if (typeof configRule === 'string') {
      rules.push(configRule);
      return;
    }

    rules.push(configRule.name);
    rules.push(...createFileStructureRules(configRule.children));
  });

  return rules;
};

const baseFileRules = createFileStructureRules([
  'config',
  'types',
  'constants',
  'utilities',
]);

const FILE_STRUCTURE_RULES = createFileStructureRules([
  {
    name: 'src',
    children: [
      {
        name: 'shared',
        children: [
          ...baseFileRules,
          'libs',
          {
            name: 'features',
            children: [
              {
                name: '*', // For the feature name.
                children: baseFileRules,
              },
            ],
          },
        ],
      },
      {
        name: 'main',
        children: [
          'shared',
          'libs',
          'features',
          'ipc',
        ],
      },
      {
        name: 'ipc',
        children: baseFileRules,
      },
      {
        name: 'renderer',
        children: [
          'shared',
          'libs',
          {
            name: 'features',
            children: [
              {
                name: '*', // For the feature name.
                children: [
                  ...baseFileRules,
                  'stores',
                  'hooks',
                  'components',
                ],
              },
            ],
          },
          'views',
          'app',
          'App.tsx',
        ],
      },
      'preload.ts',
      'app-start.ts',
    ],
  },
  'docs',
  'scripts',
]);
