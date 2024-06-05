import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserAccountUseCase } from './create-user-account.useCase';
import { CreateUserAccountErrors } from './create-user-account.errors';
import { CreateUserAccountDTO } from './create-user-account.DTO';
import { UserDTO } from '../../dtos/user.DTO';

@Controller('create')
@ApiTags('User Account')
export class CreateUserController {
  constructor(private readonly useCase: CreateUserAccountUseCase) {}
  @ApiCreatedResponse({
    description: 'create new account',
    type: UserDTO,
  })
  @Post()
  async create(@Body(new ValidationPipe()) dto: CreateUserAccountDTO) {
    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      if (
        error.constructor ===
        CreateUserAccountErrors.UserAccountAlreadyExistsError
      ) {
        throw new ConflictException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
