import { ProductsModule } from "./products.module";
import { AppFactory } from "@app/core";

AppFactory.createMicroservice(ProductsModule, { serviceName: "products" });
