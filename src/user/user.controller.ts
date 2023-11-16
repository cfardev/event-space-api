import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { GetUser } from 'src/auth/decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRoleGuard } from 'src/auth/guard/user-role.guard';
import { RoleProtected } from 'src/auth/decorator/role-protected.decorator';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard, UserRoleGuard)
  @RoleProtected(UserRole.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, UserRoleGuard)
  @RoleProtected(UserRole.ADMIN)
  @Get()
  findAll(@Query() pagination: PaginationDto, @Query() filter: FilterUserDto) {
    return this.userService.findAll(pagination, filter);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, UserRoleGuard)
  @RoleProtected(UserRole.ADMIN)
  @Get('count')
  count(@Query() filter: FilterUserDto) {
    return this.userService.count(filter);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, UserRoleGuard)
  @RoleProtected(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser('id') idUser: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.userService.update(+id, updateUserDto, idUser, avatar);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, UserRoleGuard)
  @RoleProtected(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
