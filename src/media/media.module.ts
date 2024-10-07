import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaSchema } from './models/media.model';
import { MediaService } from './services/media.service';
import { MediaRepository } from './repositories/media.repository';

import { ConfigModule } from '@nestjs/config';
import { MediaController } from './controller/media.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Media',
                schema: MediaSchema,
            },
        ]),
        ConfigModule,
    ],
    controllers: [MediaController],
    providers: [MediaService, MediaRepository],
})
export class MediaModule { }
