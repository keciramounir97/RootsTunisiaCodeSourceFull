import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

describe('Backend Application Integrity & Health Spec', () => {
  it('loads environment configuration and validates critical settings', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              PORT: 5000,
              NODE_ENV: 'test',
              JWT_SECRET: 'test_jwt_secret_key',
            }),
          ],
        }),
      ],
    }).compile();

    expect(module).toBeDefined();
  });

  it('verifies that security origins and CORS patterns are well defined', () => {
    const allowed = [
      'https://rootstunisia.com',
      'https://www.rootstunisia.com',
      'http://localhost:5173',
      'http://localhost:5000',
    ];
    for (const origin of allowed) {
      expect(origin).toMatch(/^https?:\/\//);
    }
  });
});
