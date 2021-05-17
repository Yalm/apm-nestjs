import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ApmModule } from "@app/apm";

@Module({
  imports: [ApmModule.forRoot({ serviceName: "products" })],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
