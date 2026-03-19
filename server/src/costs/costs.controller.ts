import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { UsersService } from 'src/users/users.service';

@Controller('cost')
export class CostsController {
  constructor(
    private readonly costsService: CostsService,
    private readonly authService: AuthService,
     private readonly userService: UsersService
  ) {}

@UseGuards(JWTGuard)
@Get()
@HttpCode(HttpStatus.OK)
async getAllCosts(@Req() req, @Res() res) {
    const username = req.username
    const user = await this.userService.findOne(username);

    const costs = await this.costsService.findAll();

    const filteredCosts = costs.filter(
        (cost) => cost.userId === user?._id.toString(),
    );

    return res.send(filteredCosts);
}

@UseGuards(JWTGuard)
@Post()
@HttpCode(HttpStatus.OK)
async createCost(@Body() createCostDto: CreateCostDto, @Req() req) {
   const username = req.username
    const user = await this.userService.findOne(username);

    return await this.costsService.create({
        ...createCostDto,
        userId: user?._id as string,
    });
}

  @UseGuards(JWTGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCost(
    @Body() updateCostDto: UpdateCostDto,
    @Param('id') id: string,
  ) {
    return await this.costsService.update(updateCostDto, id);
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCost(@Param('id') id: string) {
    return await this.costsService.delete(id);
  }
}