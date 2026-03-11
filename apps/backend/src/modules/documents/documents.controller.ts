import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Submit a document for review' })
  create(@CurrentUser() user: any, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(user.id, dto);
  }

  @Get('my')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get my documents' })
  findMine(@CurrentUser() user: any) {
    return this.documentsService.findMine(user.id);
  }

  @Patch(':id/review')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Review a document (admin)' })
  review(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: ReviewDocumentDto) {
    return this.documentsService.review(id, user.id, dto);
  }
}
