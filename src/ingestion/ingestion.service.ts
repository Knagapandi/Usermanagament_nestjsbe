import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestionService {
  triggerIngestion(): string {
    return 'Ingestion process started';
  }
}