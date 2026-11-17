import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Modules
import { VisionModule } from './modules/vision/vision.module';
import { FoodModule } from './modules/food/food.module';
import { CoachModule } from './modules/coach/coach.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    VisionModule,
    FoodModule,
    CoachModule,
    WorkoutsModule,
    ReportsModule,
  ],
})
export class AppModule {}
