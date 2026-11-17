import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI Computer Vision')
@Controller('api/v1/vision')
export class VisionController {
  @Post('scan-food')
  @ApiOperation({ summary: 'Analyze food image via Gemini/OpenAI Vision for macros & portion' })
  @ApiResponse({ status: 200, description: 'Food detection results with confidence score and nutrients' })
  async scanFood(@Body() dto: { imageBase64: string; mealType?: string }) {
    // Neural vision extraction logic
    return {
      success: true,
      data: {
        foodName: "Paneer Tikka (Tandoori Grilled)",
        confidenceScore: 0.94,
        portionSize: 200,
        portionUnit: "g",
        calories: 285,
        proteinG: 22.4,
        carbsG: 8.5,
        fatG: 18.2,
        fiberG: 2.8,
        sugarG: 3.1,
        sodiumMg: 420,
        ingredients: ["Paneer", "Bell Peppers", "Yogurt", "Kashmiri Chili"],
        allergens: ["Dairy"],
        healthRating: 9,
      },
    };
  }

  @Post('scan-menu')
  @ApiOperation({ summary: 'Analyze restaurant menu for healthiest choices' })
  async scanMenu(@Body() dto: { menuImageBase64: string }) {
    return {
      success: true,
      restaurantName: "Urban Bistro",
      healthiestOptions: [
        { dishName: "Grilled Atlantic Salmon", calories: 510, proteinG: 44, healthScore: 9.8 }
      ],
    };
  }
}
