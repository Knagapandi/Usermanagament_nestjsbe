import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Ingestion, IngestionStatus } from './entities/ingestion.entity';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>,
  ) {}

  // Trigger ingestion process (calls external Python API)
  async triggerIngestion(): Promise<Ingestion> {
    const ingestion = this.ingestionRepository.create({ status: IngestionStatus.IN_PROGRESS });
    await this.ingestionRepository.save(ingestion);

    try {
      // Call Python API (Replace with actual URL)
      const response = await axios.post('http://localhost:8000/start-ingestion');
      
      if (response.status === 200) {
        ingestion.status = IngestionStatus.COMPLETED;
      } else {
        ingestion.status = IngestionStatus.FAILED;
        ingestion.errorMessage = 'Python API failed';
      }
    } catch (error) {
      ingestion.status = IngestionStatus.FAILED;
      ingestion.errorMessage = error.message;
    }

    return this.ingestionRepository.save(ingestion);
  }

  // Check ingestion status
  async checkIngestionStatus(id: number): Promise<Ingestion> {
    const ingestion = await this.ingestionRepository.findOne({ where: { id } });
    if (!ingestion) throw new HttpException('Ingestion not found', HttpStatus.NOT_FOUND);
    return ingestion;
  }
}
