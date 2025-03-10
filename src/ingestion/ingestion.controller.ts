import { Controller, Post, Get, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  async triggerIngestion() {
    console.log("test ")
    return this.ingestionService.triggerIngestion();
  }

  @Get('status/:id')
  async checkIngestionStatus(@Param('id') id: number) {
    return this.ingestionService.checkIngestionStatus(id);
  }
}
