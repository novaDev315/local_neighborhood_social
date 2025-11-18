import { Module, Global } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { FileUploadService } from './services/file-upload.service';
import { WebsocketGateway } from './gateways/websocket.gateway';

@Global()
@Module({
  providers: [CacheService, FileUploadService, WebsocketGateway],
  exports: [CacheService, FileUploadService, WebsocketGateway],
})
export class CommonModule {}
