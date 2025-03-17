import { Module } from "@nestjs/common";
import { BcryptService } from "./bcrypt.module";

@Module({
    exports:[BcryptService],
    providers:[BcryptService]
})

export class BcryptModule{}