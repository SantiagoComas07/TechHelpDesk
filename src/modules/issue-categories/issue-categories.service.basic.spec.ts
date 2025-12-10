import { Test, TestingModule } from '@nestjs/testing';
import { IssueCategoriesService } from './issue-categories.service';

describe('IssueCategoriesService - Basic', () => {
  let service: IssueCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IssueCategoriesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IssueCategoriesService>(IssueCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
