# Guía de Contribución

Gracias por considerar contribuir a SaaS MVP Accelerator!

## 🤝 Cómo Contribuir

### Reportar Bugs

Usa el [bug report template](.github/ISSUE_TEMPLATE/bug_report.md):

1. Descripción clara del bug
2. Pasos para reproducir
3. Comportamiento esperado vs actual
4. Screenshots si aplica
5. Entorno (OS, browser, versión)

### Sugerir Features

Usa el [feature request template](.github/ISSUE_TEMPLATE/feature_request.md):

1. Problema que resuelve
2. Solución propuesta
3. Alternativas consideradas
4. Diseños/mockups

### Pull Requests

1. **Fork** el repositorio
2. **Crea branch** desde `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Haz cambios** siguiendo las convenciones
4. **Commit** con mensajes descriptivos
5. **Push** a tu fork
6. **Abre PR** usando el template

## 📝 Convenciones de Código

### TypeScript

```typescript
// ✅ Good
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Bad
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Nomenclatura

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Commits

Format: `type(scope): message`

Types:
- `feat`: Nueva feature
- `fix`: Bug fix
- `docs`: Documentación
- `style`: Formatting
- `refactor`: Code refactor
- `test`: Tests
- `chore`: Tooling

Examples:
```
feat(auth): add Google OAuth login
fix(dashboard): resolve metrics calculation error
docs(readme): update setup instructions
```

## 🧪 Testing

Antes de enviar PR:

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Format
npm run format

# Build
npm run build
```

## 📚 Documentación

Si tu PR afecta:
- **Arquitectura**: Actualizar `docs/ARCHITECTURE.md`
- **Setup**: Actualizar `docs/SETUP.md`
- **APIs**: Actualizar `docs/API_LIMITS.md`

## 🎓 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
