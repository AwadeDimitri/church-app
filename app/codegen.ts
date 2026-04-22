/// <reference types="node" />
import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const config: CodegenConfig = {
  schema: [
    {
      [`${process.env['SUPABASE_URL']}/graphql/v1`]: {
        headers: {
          apikey: process.env['SUPABASE_SERVICE_ROLE_KEY']!,
          Authorization: `Bearer ${process.env['SUPABASE_SERVICE_ROLE_KEY']!}`,
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
          UUID: 'string',
          Datetime: 'string',
          Date: 'string',
          Time: 'string',
          JSON: 'unknown',
          BigInt: 'string',
          BigFloat: 'string',
          Cursor: 'string',
        },
        addExplicitOverride: true,
      },
    },
  },
};

export default config;
