import { typeCheck } from "./scripts/report/plugins/analyse-type-check";
import { createQualityReportConfig } from "./scripts/report/utilities/config";

export default createQualityReportConfig({
  analyses: [
    // TODO: Make a factory such as typeCheck('type-check'),
    typeCheck({
      custom: {
        configFilePath: './tsconfig.json',
      },
      name: 'type-check',
      priority: [
        {
          category: 'lint',
          priority: 'mute',
          paths: [
            '!src/**/*.ts',
          ],
        },
      ]
    }),
    // unitTestCoverage({
    //   needs: 'type-check',
    //   priority: [
    //     {
    //       analysis: 'unit-test',
    //       category: 'coverage',
    //       priority: 'highlight',
    //       paths: [
    //         'src/**/utilities/**/*.ts',
    //         'src/**/utilities/*.ts',
    //         'src/**/utilities.ts',
    //       ],
    //     },
    //     {
    //       analysis: 'unit-test',
    //       category: 'coverage',
    //       priority: 'mute',
    //       paths: [
    //         'src/**/*.test.ts',
    //       ],
    //     },
    //   ]
    // }),
    // Integration test coverage also needs a type-check first or it will
    // probably fail the build anyway.
    // ESLint may as well type-check first.
    // Knip's dead code check...
    // Do any of these really *need* anything to continue extractions?
    // Perhaps the report could run in several "modes".
    // E.g. by default, CI just runs everything.
  ],
  paths: {
    base: './',
    report: 'reports/quality-analysis.json',
  },
  priority: [
    {
      analysis: 'type-check',
      category: 'lint',
      priority: 'mute',
      paths: [
        '!src/**/*.ts',
      ],
    },
    {
      analysis: 'unit-test',
      category: 'coverage',
      priority: 'highlight',
      paths: [
        'src/**/utilities/**/*.ts',
        'src/**/utilities/*.ts',
        'src/**/utilities.ts',
      ],
    },
    {
      analysis: 'unit-test',
      category: 'coverage',
      priority: 'mute',
      paths: [
        'src/**/*.test.ts',
      ],
    },
  ],
});
