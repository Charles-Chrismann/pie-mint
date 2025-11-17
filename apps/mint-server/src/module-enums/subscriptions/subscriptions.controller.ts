import { Controller, Get, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private subscriptionsService: SubscriptionsService
  ) { }

  @Get('')
  getAllSubscriptions() {
    return this.subscriptionsService.getAllSubscriptions()
  }

  @Get(':name')
  getSubscriptionByName(
    @Param('name') name: string
  ) {
    return this.subscriptionsService.getSubscriptionByName(name)
  }
}
