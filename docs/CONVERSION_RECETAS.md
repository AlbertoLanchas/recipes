## Guía: Convertir un Markdown de receta en receta funcional (con switch Omnívoro/Vegano)

### Objetivo
Esta guía explica cómo tomar una receta en Markdown (con versiones omnívora y vegana) y transformarla en una receta funcional del proyecto, incluyendo:
- Estructuras `RecipeData` para ambas versiones
- Función helper de switch por dieta
- Registro en los índices globales para que la UI cambie ingredientes, pasos y descripciones correctamente

### Supuestos de entrada (Markdown)
- Dos archivos: uno omnívoro y otro vegano (misma receta/plato)
- Secciones claras de: “INGREDIENTES …” y “PASOS POR FASE (…): FASE 1/2/3 … [Paso X] …”
- Unidades coherentes (g, ml, piece, tsp, etc.)

### Estructura de destino (RecipeData)
Una receta se modela con:
- `id`, `difficulty`, `time`, `servings`, `categoryId`, `animeId`, `image`, `backgroundImage`
- `ingredients`: lista con `ingredientId`, `amount`, `unit`, `notes`
- `phases`: lista de fases con `id`, `order`, `translations` (al menos `es` y `en`) y `steps`
- `translations` de la receta (al menos `es` y `en`) con `title` y `description`
- `tags`, `nutritionInfo`, `createdAt`, `updatedAt`

### Paso a paso
1) Crear directorio de la receta
- **Ruta**: `data/recipes/<anime>/<recipe-id>/`
- **Archivos**: `data.ts` e `index.ts`

2) Verificar ingredientes
- Buscar cada ingrediente en `data/core/ingredients.ts`.
- Si **no existe**, añadirlo con:
  - **id** en kebab-case (ej. `curry-roux-block`)
  - `emoji`, `unit` base
  - `translations` (mínimo `es` y `en`; idealmente las 15 ya usadas)
  - `tags` relevantes

3) Construir `ingredients` en `data.ts`
- Para cada ingrediente del Markdown:
  - Mapear nombre → `ingredientId` del sistema
  - Definir `amount`, `unit`, `notes` (si aplica)

4) Construir `phases` con pasos
- Crear 1 fase por “FASE N” del Markdown
- `id`: kebab-case (ej. `broth-preparation`)
- `order`: 1, 2, 3, …
- `translations.es.title` y `.en.title` (mínimo)
- `steps`: array de `{ instruction }` por cada [Paso X]

5) Traducciones de receta
- `translations.es.title/description`
- `translations.en.title/description`

6) Metadatos mínimos
- `difficulty`: 1–5
- `time`: minutos totales
- `servings`: raciones por defecto
- `categoryId`: ej. `main-course`
- `animeId`: ej. `pirates`
- `image`/`backgroundImage`: usar imágenes existentes si aplica
- `tags` y `nutritionInfo` (aprox.)

7) Soporte Omnívoro/Vegano
- Crear dos constantes `RecipeData`: `<recipeConst>` (omnívoro) y `<recipeConst>Vegan` (vegano)
- Añadir helper:
```ts
export const get<PascalRecipeId>ByDiet = (isVegan: boolean): RecipeData => {
  return isVegan ? <recipeConst>Vegan : <recipeConst>;
};
```
- Exportar en `index.ts` del plato:
```ts
export { get<PascalRecipeId>ByDiet, <recipeConst>, <recipeConst>Vegan } from './data';
```

8) Registro global de recetas
- Editar `data/recipes/index.ts`:
  - Importar la receta base y añadirla a `allRecipes`
  - Re-exportar: `export { get<PascalRecipeId>ByDiet, <recipeConst>, <recipeConst>Vegan } from '../recipes/<anime>/<recipe-id>';`
  - Añadir el `id` a `hasMultipleDietVersions()` si existen ambas versiones
  - Añadir un branch en `getRecipeByIdAndDiet(id, isVegan)`:
```ts
if (id === '<recipe-id>') {
  const { get<PascalRecipeId>ByDiet } = require('../recipes/<anime>/<recipe-id>');
  return get<PascalRecipeId>ByDiet(isVegan);
}
```

9) Registro por anime
- Editar `data/recipes/<anime>.ts` para **incluir la receta base** en el array del anime:
```ts
import { <recipeConst> } from './<anime>/<recipe-id>';

export const <anime>Recipes: RecipeData[] = [
  // ... otras
  <recipeConst>,
];
```

10) UI y switch de dieta (ya integrado)
- El detalle de receta (`app/recipe/[id].tsx`) ya usa:
  - `getRecipeByIdAndDiet(recipeId, isVegan)`
  - `hasMultipleDietVersions(id)` para habilitar/deshabilitar el switch
- Asegúrate de que el `id` de la receta esté en `hasMultipleDietVersions` y con su branch en `getRecipeByIdAndDiet`

### Plantilla de `data.ts` (doble versión + helper)
```ts
import { RecipeData } from '@/types/recipe-new';

export const <recipeConst>: RecipeData = {
  id: '<recipe-id>',
  difficulty: 2,
  time: 30,
  servings: 2,
  isFavorite: false,
  categoryId: 'main-course',
  animeId: '<anime-id>',
   
   
  ingredients: [
    { ingredientId: '<id-existente>', amount: 100, unit: 'g' },
  ],
  phases: [
    { id: 'phase-1', order: 1, translations: {
      es: { title: 'Fase 1', steps: [{ instruction: 'Paso 1…' }] },
      en: { title: 'Phase 1', steps: [{ instruction: 'Step 1…' }] },
    }},
  ],
  translations: {
    es: { title: 'Título ES', description: 'Descripción ES', phases: [] },
    en: { title: 'Title EN', description: 'Description EN', phases: [] },
  },
  tags: ['tag1','tag2'],
  nutritionInfo: { calories: 500, protein: 20, carbs: 60, fat: 15 },
  createdAt: 'YYYY-MM-DD',
  updatedAt: 'YYYY-MM-DD'
};

export const <recipeConst>Vegan: RecipeData = {
  // igual que arriba, con ingredientes/pasos veganos
  id: '<recipe-id>',
  // ...
};

export const get<PascalRecipeId>ByDiet = (isVegan: boolean): RecipeData => {
  return isVegan ? <recipeConst>Vegan : <recipeConst>;
};
```

### Checklist rápida
- **Ingredientes**: ¿todos existen en `data/core/ingredients.ts`?
- **Fases y pasos**: ¿todas las fases y pasos del Markdown están reflejados?
- **Traducciones**: `es` y `en` al menos, en receta y fases
- **Helper**: `get<PascalRecipeId>ByDiet` creado y exportado
- **Registros**:
  - Añadido a `allRecipes`
  - Re-export correcto
  - `hasMultipleDietVersions` incluye el `id`
  - Branch en `getRecipeByIdAndDiet`
  - Añadido a `<anime>.ts`
- **Lint**: ejecutar `npm run lint` y corregir errores
- **Prueba UI**: abrir receta, alternar switch; deben cambiar ingredientes, fases y descripción

### Notas
- Usa `kebab-case` para `id` y `snake/verbos` claros para `phase.id`
- Unidades comunes: `g`, `ml`, `piece`, `tsp`, `tbsp`
- Si la receta solo tiene una versión y es vegana por naturaleza, no añadir a `hasMultipleDietVersions` y mostrar el switch deshabilitado (la UI ya lo maneja)


