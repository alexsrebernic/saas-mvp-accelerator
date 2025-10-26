#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
  'MP_ACCESS_TOKEN',
  'RESEND_API_KEY',
];

async function checkDependencies() {
  console.log(chalk.blue.bold('\n🔍 Verificando configuración del proyecto...\n'));

  let hasErrors = false;
  let hasWarnings = false;

  // 1. Verificar que existe .env.local
  const envPath = path.join(projectRoot, '.env.local');
  const envExists = await fs.pathExists(envPath);

  if (!envExists) {
    console.log(chalk.yellow('⚠️  Advertencia: .env.local no existe'));
    console.log(chalk.gray('   Ejecuta: npm run setup:env\n'));
    hasWarnings = true;
  } else {
    // 2. Leer y parsear .env.local
    const envContent = await fs.readFile(envPath, 'utf8');
    const envVars = parseEnv(envContent);

    // 3. Verificar variables requeridas
    console.log(chalk.white('Variables de entorno requeridas:'));
    for (const varName of requiredEnvVars) {
      if (!envVars[varName] || envVars[varName].trim() === '') {
        console.log(chalk.red(`  ✗ ${varName}: FALTA`));
        hasErrors = true;
      } else {
        console.log(chalk.green(`  ✓ ${varName}: configurada`));
      }
    }

    // 4. Verificar variables opcionales
    console.log(chalk.white('\nVariables de entorno opcionales:'));
    for (const varName of optionalEnvVars) {
      if (!envVars[varName] || envVars[varName].trim() === '') {
        console.log(chalk.gray(`  - ${varName}: no configurada`));
      } else {
        console.log(chalk.green(`  ✓ ${varName}: configurada`));
      }
    }
  }

  // 5. Verificar que existen archivos críticos
  console.log(chalk.white('\n\nArchivos críticos:'));
  const criticalFiles = [
    'CLAUDE.md',
    'PRD.md',
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
  ];

  for (const file of criticalFiles) {
    const filePath = path.join(projectRoot, file);
    const exists = await fs.pathExists(filePath);
    if (exists) {
      console.log(chalk.green(`  ✓ ${file}`));
    } else {
      console.log(chalk.red(`  ✗ ${file}: FALTA`));
      hasErrors = true;
    }
  }

  // 6. Verificar node_modules
  console.log(chalk.white('\nDependencias:'));
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  const nodeModulesExists = await fs.pathExists(nodeModulesPath);

  if (nodeModulesExists) {
    console.log(chalk.green('  ✓ node_modules instalado'));
  } else {
    console.log(chalk.yellow('  ⚠️  node_modules no encontrado'));
    console.log(chalk.gray('     Ejecuta: npm install\n'));
    hasWarnings = true;
  }

  // Resumen final
  console.log(chalk.white('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  if (hasErrors) {
    console.log(chalk.red.bold('\n❌ Errores encontrados. Corrígelos antes de continuar.\n'));
    process.exit(1);
  } else if (hasWarnings) {
    console.log(chalk.yellow.bold('\n⚠️  Advertencias encontradas. Revisa la configuración.\n'));
    process.exit(0);
  } else {
    console.log(chalk.green.bold('\n✅ Todo listo! El proyecto está correctamente configurado.\n'));
    process.exit(0);
  }
}

function parseEnv(content) {
  const vars = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        vars[key.trim()] = valueParts.join('=').trim();
      }
    }
  }

  return vars;
}

checkDependencies().catch(error => {
  console.error(chalk.red('\n❌ Error durante la verificación:'), error);
  process.exit(1);
});
