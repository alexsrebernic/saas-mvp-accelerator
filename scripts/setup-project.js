#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import ora from 'ora';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log(
  chalk.blue.bold(`
╔═══════════════════════════════════════╗
║     🚀 SaaS MVP Accelerator Setup     ║
║          by Alex Srebernic            ║
╚═══════════════════════════════════════╝
`)
);

async function setupProject() {
  try {
    // 1. Recopilar información del proyecto
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: '📝 Nombre del proyecto (kebab-case):',
        validate: input => {
          if (!input) return 'El nombre es requerido';
          if (!/^[a-z0-9-]+$/.test(input))
            return 'Usa solo minúsculas, números y guiones';
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: '📋 Descripción breve (elevator pitch):',
        validate: input => (input.length > 10 ? true : 'Mínimo 10 caracteres'),
      },
      {
        type: 'list',
        name: 'projectType',
        message: '🎯 Tipo de SaaS:',
        choices: [
          'B2B - Enterprise',
          'B2B - SMB',
          'B2C - Consumer',
          'Marketplace',
          'Internal Tool',
          'API Service',
        ],
      },
      {
        type: 'checkbox',
        name: 'features',
        message: '✨ Features del MVP (selecciona las necesarias):',
        choices: [
          { name: 'Authentication (Supabase Auth)', checked: true },
          { name: 'Payment Processing (Stripe)', checked: false },
          { name: 'Payment Processing (MercadoPago - LATAM)', checked: false },
          { name: 'File Upload (Supabase Storage)', checked: false },
          { name: 'Real-time Updates', checked: false },
          { name: 'Email Notifications (Resend)', checked: false },
          { name: 'AI Integration (OpenAI)', checked: false },
          { name: 'Multi-tenant Architecture', checked: false },
          { name: 'Admin Dashboard', checked: false },
          { name: 'Analytics Dashboard', checked: false },
        ],
      },
      {
        type: 'list',
        name: 'region',
        message: '🌍 Región principal de operación:',
        choices: [
          'Argentina',
          'LATAM (Latinoamérica)',
          'USA/Global',
          'Europa',
          'Multi-region',
        ],
      },
      {
        type: 'list',
        name: 'pricing',
        message: '💰 Modelo de precios inicial:',
        choices: [
          'Freemium',
          'Free Trial → Paid',
          'Usage-based',
          'Tiered Subscription',
          'One-time Payment',
          'Por definir',
        ],
      },
      {
        type: 'input',
        name: 'mvpPrice',
        message: '💵 Precio mínimo mensual del plan básico (USD):',
        default: '9.99',
        when: answers => answers.pricing !== 'Por definir',
      },
      {
        type: 'confirm',
        name: 'setupSupabase',
        message: '🗄️  ¿Configurar proyecto de Supabase ahora?',
        default: false,
      },
    ]);

    const spinner = ora('Configurando proyecto...').start();

    // 2. Generar archivos personalizados
    spinner.text = 'Generando CLAUDE.md y PRD.md...';
    await generateProjectFiles(answers);

    // 3. Actualizar package.json con el nombre del proyecto
    spinner.text = 'Actualizando package.json...';
    await updatePackageJson(answers.projectName);

    // 4. Generar .env.local
    spinner.text = 'Configurando variables de entorno...';
    await generateEnvFile(answers);

    // 5. Configurar i18n si es LATAM
    if (
      answers.region === 'Argentina' ||
      answers.region === 'LATAM (Latinoamérica)'
    ) {
      spinner.text = 'Configurando i18n para LATAM...';
      await setupI18n();
    }

    spinner.succeed(chalk.green('✅ Proyecto configurado exitosamente!'));

    // 6. Mostrar próximos pasos
    showNextSteps(answers);
  } catch (error) {
    console.error(chalk.red('❌ Error durante el setup:'), error);
    process.exit(1);
  }
}

async function generateProjectFiles(config) {
  const timestamp = new Date().toISOString().split('T')[0];

  // Generar CLAUDE.md
  const claudeTemplate = await fs.readFile(
    path.join(projectRoot, 'templates/CLAUDE.md.template'),
    'utf8'
  );

  const features = config.features.map(f => `- ${f}`).join('\n');

  const claudeContent = claudeTemplate
    .replace(/\{\{PROJECT_NAME\}\}/g, config.projectName)
    .replace(/\{\{DESCRIPTION\}\}/g, config.description)
    .replace(/\{\{PROJECT_TYPE\}\}/g, config.projectType)
    .replace(/\{\{FEATURES\}\}/g, features)
    .replace(/\{\{PRICING_MODEL\}\}/g, config.pricing)
    .replace(/\{\{MVP_PRICE\}\}/g, config.mvpPrice || 'TBD')
    .replace(/\{\{TIMESTAMP\}\}/g, timestamp)
    .replace(/\{\{REGION\}\}/g, config.region);

  await fs.writeFile(path.join(projectRoot, 'CLAUDE.md'), claudeContent);

  // Generar PRD.md
  const prdTemplate = await fs.readFile(
    path.join(projectRoot, 'templates/PRD.md.template'),
    'utf8'
  );

  const prdContent = prdTemplate
    .replace(/\{\{PROJECT_NAME\}\}/g, config.projectName)
    .replace(/\{\{DESCRIPTION\}\}/g, config.description)
    .replace(/\{\{PROJECT_TYPE\}\}/g, config.projectType)
    .replace(/\{\{PRICING_MODEL\}\}/g, config.pricing)
    .replace(/\{\{MVP_PRICE\}\}/g, config.mvpPrice || 'TBD')
    .replace(/\{\{TIMESTAMP\}\}/g, timestamp);

  await fs.writeFile(path.join(projectRoot, 'PRD.md'), prdContent);
}

async function updatePackageJson(projectName) {
  const packagePath = path.join(projectRoot, 'package.json');
  const pkg = await fs.readJSON(packagePath);
  pkg.name = projectName;
  await fs.writeJSON(packagePath, pkg, { spaces: 2 });
}

async function generateEnvFile(config) {
  let envContent = `# ${config.projectName} - Environment Variables
# Generated on ${new Date().toISOString()}

NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="${config.projectName}"
`;

  // Always include Supabase
  envContent += `\n# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=\n`;

  if (config.features.includes('AI Integration (OpenAI)')) {
    envContent += `\n# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4-turbo-preview\n`;
  }

  if (config.features.includes('Payment Processing (Stripe)')) {
    envContent += `\n# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\n`;
  }

  if (config.features.includes('Payment Processing (MercadoPago - LATAM)')) {
    envContent += `\n# MercadoPago (Argentina/LATAM)
MP_ACCESS_TOKEN=
MP_PUBLIC_KEY=
NEXT_PUBLIC_MP_PUBLIC_KEY=\n`;
  }

  if (config.features.includes('Email Notifications (Resend)')) {
    envContent += `\n# Resend (Email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@${config.projectName}.com\n`;
  }

  await fs.writeFile(path.join(projectRoot, '.env.local'), envContent);
}

async function setupI18n() {
  // Crear archivos de traducción básicos
  const esCommon = {
    common: {
      welcome: 'Bienvenido',
      login: 'Iniciar Sesión',
      signup: 'Registrarse',
      logout: 'Cerrar Sesión',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
    },
  };

  const enCommon = {
    common: {
      welcome: 'Welcome',
      login: 'Log In',
      signup: 'Sign Up',
      logout: 'Log Out',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
    },
  };

  await fs.writeJSON(
    path.join(projectRoot, 'locales/es/common.json'),
    esCommon,
    { spaces: 2 }
  );
  await fs.writeJSON(
    path.join(projectRoot, 'locales/en/common.json'),
    enCommon,
    { spaces: 2 }
  );
}

function showNextSteps(config) {
  console.log(
    chalk.cyan.bold(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 ¡Setup completado! Próximos pasos:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
  );

  console.log(chalk.white('1️⃣  Instalar dependencias:'));
  console.log(chalk.gray('   npm install\n'));

  if (config.setupSupabase) {
    console.log(chalk.white('2️⃣  Configurar Supabase:'));
    console.log(chalk.gray('   - Ve a https://app.supabase.com'));
    console.log(chalk.gray('   - Crea un nuevo proyecto'));
    console.log(chalk.gray('   - Copia las API keys a .env.local'));
    console.log(chalk.gray('   - Ejecuta: npm run db:push\n'));
  } else {
    console.log(
      chalk.white('2️⃣  Configurar variables de entorno en .env.local\n')
    );
  }

  console.log(chalk.white('3️⃣  Iniciar desarrollo:'));
  console.log(chalk.gray('   npm run dev\n'));

  console.log(chalk.white('4️⃣  Revisar la documentación:'));
  console.log(chalk.gray('   - CLAUDE.md: Contexto del proyecto'));
  console.log(chalk.gray('   - PRD.md: Requirements completos'));
  console.log(chalk.gray('   - docs/: Guías técnicas\n'));

  console.log(chalk.yellow('📚 Recursos útiles:'));
  console.log(chalk.gray('   - Next.js: https://nextjs.org/docs'));
  console.log(chalk.gray('   - Supabase: https://supabase.com/docs'));
  console.log(chalk.gray('   - Tailwind: https://tailwindcss.com/docs\n'));

  console.log(
    chalk.green.bold('🚀 ¡Listo para construir tu MVP en 14 días!\n')
  );
}

// Ejecutar setup
setupProject().catch(error => {
  console.error(chalk.red('Error fatal:'), error);
  process.exit(1);
});
