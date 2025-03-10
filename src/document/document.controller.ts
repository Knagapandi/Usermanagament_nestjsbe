import { Controller, Get, Post, Param, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // File upload route
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, 
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image') && !file.mimetype.startsWith('application/pdf')) {
          return callback(new Error('Only images and PDFs are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.documentService.saveFileMetadata(file.filename, file.mimetype, file.path);
  }

  // Get all documents
  @Get()
  async getAllDocuments() {
    return this.documentService.findAll();
  }

  // Download file by ID
  @Get(':id')
  async downloadFile(@Param('id') id: number, @Res() res: Response) {
    const document = await this.documentService.findOne(id);
    return res.sendFile(document.path, { root: '.' });
  }
}
