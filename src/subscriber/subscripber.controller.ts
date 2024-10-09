import { Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AuthGuard } from "@nestjs/passport";


@Controller('subscriber')
export class SubscriberController {
    constructor(@Inject('SUBSCRIBER_SERVICE')
    private readonly subscriberService: ClientProxy,) {

    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getSubscriber() {
        return this.subscriberService.send({
            cmd: 'get-all-subscriber',
        },
            {},
        );
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createSubscriber(@Req() req: any) {
        return this.subscriberService.send({
            cmd: 'add-subscriber',
        },
            req.user,
        );
    }

    @Post('event')
    @UseGuards(AuthGuard('jwt'))
    async createSubscriberEvent(@Req() req: any) {
        this.subscriberService.emit('subscriber-created', req.user);

        return true
    }
}