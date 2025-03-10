import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  // Save file metadata after upload
  async saveFileMetadata(filename: string, mimetype: string, path: string): Promise<Document> {
    const document = this.documentRepository.create({ filename, mimetype, path });
    return this.documentRepository.save(document);
  }

  // Get all documents
  async findAll(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  // Get document by ID
  async findOne(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }
}
