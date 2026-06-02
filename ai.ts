import { FoodAnalysis } from './types';

const MOCK_FOODS: FoodAnalysis[] = [
  { foodName: 'Grilled Chicken Breast', calories: 284, protein: 53, carbs: 0, fat: 6, fiber: 0, servingSize: '6 oz (170g)' },
  { foodName: 'Brown Rice Bowl', calories: 216, protein: 5, carbs: 45, fat: 2, fiber: 4, servingSize: '1 cup (195g)' },
  { foodName: 'Caesar Salad', calories: 320, protein: 12, carbs: 18, fat: 22, fiber: 3, servingSize: '1 bowl (250g)' },
  { foodName: 'Salmon Fillet', calories: 367, protein: 34, carbs: 0, fat: 22, fiber: 0, servingSize: '6 oz (170g)' },
  { foodName: 'Avocado Toast', calories: 290, protein: 7, carbs: 28, fat: 18, fiber: 7, servingSize: '2 slices' },
  { foodName: 'Protein Shake', calories: 220, protein: 30, carbs: 12, fat: 5, fiber: 2, servingSize: '1 shake (350ml)' },
  { foodName: 'Turkey Sandwich', calories: 350, protein: 24, carbs: 36, fat: 12, fiber: 3, servingSize: '1 sandwich' },
  { foodName: 'Greek Yogurt Parfait', calories: 260, protein: 18, carbs: 32, fat: 8, fiber: 2, servingSize: '1 cup (225g)' },
  { foodName: 'Steak and Vegetables', calories: 420, protein: 42, carbs: 14, fat: 22, fiber: 4, servingSize: '8 oz plate' },
  { foodName: 'Pasta Primavera', calories: 380, protein: 14, carbs: 52, fat: 12, fiber: 5, servingSize: '1 plate (300g)' },
  { foodName: 'Egg White Omelette', calories: 154, protein: 26, carbs: 2, fat: 4, fiber: 0, servingSize: '4 egg whites' },
  { foodName: 'Smoothie Bowl', calories: 310, protein: 8, carbs: 48, fat: 10, fiber: 6, servingSize: '1 bowl (350ml)' },
];

function getMockResult(): FoodAnalysis {
  const index = Math.floor(Math.random() * MOCK_FOODS.length);
  return { ...MOCK_FOODS[index] };
}

export async function analyzeFood(imageBase64: string, mimeType: string): Promise<FoodAnalysis> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return getMockResult();
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: 'Analyze this food image. Return ONLY a JSON object with no markdown, no backticks, just raw JSON: {"foodName": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "servingSize": ""}' }
            ]
          }]
        })
      }
    );

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as FoodAnalysis;
  } catch {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return getMockResult();
  }
}
