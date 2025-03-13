import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';


 export const getTypeOrmModuleOptions = (
  configService:ConfigService
 ):TypeOrmModuleOptions => {

 const envDatabaseConfiguration =configService.get('database')

 return {
  ...envDatabaseConfiguration,
  logging:false,
  synchronization:true,
  entities: [__dirname + '/../orm/entities/*.entity{.ts,.js}'],
  // ssl:{
  //   rejectedUnauthorized:false
  // }
 }
}
 @Module({
  imports:[
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory:getTypeOrmModuleOptions
    })
  ]
 })

 export class DatabaseOrmConfigModule{}