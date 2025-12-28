import { resolve } from 'path';
import { generateApi } from 'swagger-typescript-api';

generateApi({
    name: 'Api.ts',
    output: resolve(process.cwd(), './src/api/generated'),
    url: 'http://localhost:8000/swagger/?format=openapi',
    httpClientType: 'axios',
});

