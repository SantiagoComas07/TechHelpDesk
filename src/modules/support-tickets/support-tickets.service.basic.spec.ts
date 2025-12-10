import { Test, TestingModule } from '@nestjs/testing';
import { SupportTicketsService } from './support-tickets.service';

describe('SupportTicketsService - Basic', () => {
  let service: SupportTicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SupportTicketsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByStatus: jest.fn(),
            findByCustomer: jest.fn(),
            updateStatus: jest.fn(),
            assignTicket: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SupportTicketsService>(SupportTicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
