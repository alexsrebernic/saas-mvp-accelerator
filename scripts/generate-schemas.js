#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Genera schemas Zod a partir de una tabla de Supabase
 * Este es un helper script - expande según tus necesidades
 */

async function generateSchemas() {
  console.log(
    chalk.blue.bold('\n🔧 Generador de Schemas Zod desde Supabase\n')
  );

  // Ejemplo de schema generado
  const exampleSchema = `import { z } from 'zod';

// User Profile Schema
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1, 'El nombre es requerido').max(100),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  subscription_tier: z.enum(['free', 'pro', 'enterprise']).default('free'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Partial schemas para updates
export const updateUserProfileSchema = userProfileSchema.partial().omit({
  id: true,
  created_at: true,
});

// Insert schema (sin campos auto-generados)
export const insertUserProfileSchema = userProfileSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
`;

  const schemasPath = path.join(
    projectRoot,
    'src/lib/validations/schemas.ts'
  );

  await fs.writeFile(schemasPath, exampleSchema);

  console.log(chalk.green('✅ Schema de ejemplo generado en:'));
  console.log(chalk.gray(`   ${schemasPath}\n`));

  console.log(chalk.yellow('💡 Próximos pasos:'));
  console.log(
    chalk.gray('   1. Ejecuta: npm run db:generate-types (genera tipos de Supabase)')
  );
  console.log(
    chalk.gray('   2. Actualiza schemas.ts basándote en tus tablas')
  );
  console.log(chalk.gray('   3. Importa y usa en tus Server Actions\n'));
}

generateSchemas().catch(error => {
  console.error(chalk.red('❌ Error:'), error);
  process.exit(1);
});
