import { TestBed } from '@angular/core/testing';

import { DiarioBotService } from './diario-bot.service';

describe('DiarioBotService', () => {
  let service: DiarioBotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiarioBotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
