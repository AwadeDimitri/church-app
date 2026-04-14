import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const config: CodegenConfig = {
  schema: [
    {
      [process.env['HASURA_GRAPHQL_URL']!]: {
        headers: {
          'x-hasura-admin-secret': process.env['HASURA_ADMIN_SECRET']!,
        },
      },
    },
  ],
  documents: 'src/**/*.graphql',
  generates: {
    'src/app/core/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
      config: {
        scalars: {
          uuid: 'string',
          timestamptz: 'string',
          numeric: 'number',
          smallint: 'number',
        },
        addExplicitOverride: true,
      },
    },
  },
};

export default config;
