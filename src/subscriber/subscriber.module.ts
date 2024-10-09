import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SubscriberController } from './subscripber.controller';


@Module({
    imports: [ConfigModule],
    controllers: [SubscriberController],
    providers: [
        {
            provide: 'SUBSCRIBER_SERVICE',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('SUBSCRIBER_SERVICE_HOST'),
                        port: configService.get('SUBSCRIBER_SERVICE_PORT'),
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
})
export class SubscriberModule { }