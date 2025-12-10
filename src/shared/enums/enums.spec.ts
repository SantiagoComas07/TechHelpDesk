import { UserRole } from './use.role.enum';
import { TicketStatus } from './ticket.status.enum';
import { TicketPriority } from './ticket.priority.enum';

describe('Enums', () => {
  describe('UserRole', () => {
    it('should have ADMINISTRATOR role', () => {
      expect(UserRole.ADMINISTRATOR).toBeDefined();
    });

    it('should have AGENT role', () => {
      expect(UserRole.AGENT).toBeDefined();
    });

    it('should have CUSTOMER role', () => {
      expect(UserRole.CUSTOMER).toBeDefined();
    });
  });

  describe('TicketStatus', () => {
    it('should have OPEN status', () => {
      expect(TicketStatus.OPEN).toBeDefined();
    });

    it('should have IN_PROGRESS status', () => {
      expect(TicketStatus.IN_PROGRESS).toBeDefined();
    });

    it('should have RESOLVED status', () => {
      expect(TicketStatus.RESOLVED).toBeDefined();
    });

    it('should have CLOSED status', () => {
      expect(TicketStatus.CLOSED).toBeDefined();
    });
  });

  describe('TicketPriority', () => {
    it('should have LOW priority', () => {
      expect(TicketPriority.LOW).toBeDefined();
    });

    it('should have NORMAL priority', () => {
      expect(TicketPriority.NORMAL).toBeDefined();
    });

    it('should have HIGH priority', () => {
      expect(TicketPriority.HIGH).toBeDefined();
    });

    it('should have URGENT priority', () => {
      expect(TicketPriority.URGENT).toBeDefined();
    });
  });
});
