import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedMimeTypes: string[];

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DEST', './uploads');
    this.maxFileSize = this.configService.get('MAX_FILE_SIZE', 10485760); // 10MB
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ];
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Validate MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed`,
      );
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExtension}`;
    const uploadPath = path.join(this.uploadDir, folder);
    const filePath = path.join(uploadPath, filename);

    // Create directory if it doesn't exist
    await fs.mkdir(uploadPath, { recursive: true });

    // Save file
    await fs.writeFile(filePath, file.buffer);

    // Return file URL (in production, this would be a CDN URL)
    return `/uploads/${folder}/${filename}`;
  }

  async uploadMultiple(files: Express.Multer.File[], folder: string): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), fileUrl);
      await fs.unlink(filePath);
    } catch (error) {
      // File doesn't exist or can't be deleted
      console.error('Error deleting file:', error);
    }
  }

  validateImageDimensions(width: number, height: number, maxWidth = 4096, maxHeight = 4096): boolean {
    return width <= maxWidth && height <= maxHeight;
  }

  getFileExtension(filename: string): string {
    return path.extname(filename).toLowerCase();
  }

  isImage(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  isVideo(mimetype: string): boolean {
    return mimetype.startsWith('video/');
  }

  // In production, integrate with AWS S3, Cloudinary, or similar
  async uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
    // TODO: Implement S3 upload
    // const s3 = new AWS.S3();
    // const uploadResult = await s3.upload({
    //   Bucket: this.configService.get('AWS_S3_BUCKET'),
    //   Key: `${folder}/${uuidv4()}${path.extname(file.originalname)}`,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    // }).promise();
    // return uploadResult.Location;

    // For now, use local storage
    return this.uploadFile(file, folder);
  }
}
