import { Test, TestingModule } from '@nestjs/testing';
import { SupportAgentsService } from './support-agents.service';

describe('SupportAgentsService - Basic', () => {
  let service: SupportAgentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SupportAgentsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getAvailableAgents: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SupportAgentsService>(SupportAgentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
