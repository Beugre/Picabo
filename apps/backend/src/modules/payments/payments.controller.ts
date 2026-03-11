import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment for a trip' })
  initiatePayment(@CurrentUser() user: any, @Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(user.id, dto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Payment provider webhook callback' })
  handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status' })
  getPayment(@Param('id') id: string) {
    return this.paymentsService.getPayment(id);
  }
}
