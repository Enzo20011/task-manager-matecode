# Gestor estratégico de tareas — PIM4

Aplicación web SPA del gestor estratégico de tareas. Permite autenticación de usuarios, CRUD de tareas persistido en Firestore, envío de resúmenes por email con AWS SES, y deploy en producción.

## 🚀 Demo

🔗 **https://task-manager-matecode.vercel.app**

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Auth + DB | Firebase (Auth + Firestore) |
| Email | AWS SES via Vercel Functions |
| Deploy | Vercel |
| Testing | Vitest + React Testing Library |

---

## 📁 Estructura del proyecto

```
project-root/
├── src/
│   ├── pages/          # Vistas: LoginPage, RegisterPage, TasksPage
│   ├── components/     # UI: TodoForm, TodoList, TodoItem
│   ├── features/       # Lógica por dominio (auth, tasks)
│   ├── services/       # Firebase, authService, taskService
│   ├── routes/         # ProtectedRoute
│   ├── hooks/          # useAuth, useTasks
│   ├── types/          # Tipos e interfaces TypeScript
│   └── utils/          # Helpers
├── api/
│   └── send-email.ts   # Vercel Function — AWS SES
├── tests/
│   ├── components/     # Tests de componentes
│   └── services/       # Tests de servicios
├── .env.example
└── README.md
```

---

## ⚙️ Instalación y configuración local

### 1. Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/task-manager-matecode.git
cd task-manager-matecode
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y completar con tus credenciales:

```bash
cp .env.example .env
```

### 4. Iniciar en desarrollo

```bash
npm run dev
```

La app estará en: `http://localhost:5173`

---

## 🔑 Variables de entorno

```env
# Firebase — obtener desde Firebase Console > Configuración del proyecto
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# AWS SES — solo para Vercel Functions, NUNCA en el frontend
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
SES_FROM_EMAIL=
```

> ⚠️ El archivo `.env` está en `.gitignore` y NUNCA debe subirse al repositorio.

---

## 📧 Flujo de envío de emails

1. El usuario hace clic en **"Enviar resumen"** en la página de tareas.
2. El frontend llama a `POST /api/send-email` con el email del usuario y la lista de tareas.
3. La **Vercel Function** (`api/send-email.ts`) recibe la solicitud del lado del servidor.
4. La función usa el **AWS SDK** para llamar a AWS SES con las credenciales de entorno.
5. AWS SES envía el email HTML con el resumen de tareas al usuario.

Las credenciales de AWS **nunca se exponen al cliente**: viven únicamente en variables de entorno del servidor (Vercel).

---

## 🏗 Decisiones arquitectónicas

- **BaaS con Firebase**: Se eligió Firebase (Auth + Firestore) para evitar un backend propio, cumpliendo el requisito de solución rápida y escalable.
- **Vercel Functions para emails**: AWS SES requiere credenciales secretas; usar Vercel Functions mantiene los secretos en el servidor y el frontend limpio.
- **Filtrado por `userId`**: Todas las queries a Firestore incluyen `where('userId', '==', uid)` garantizando que cada usuario solo ve sus propias tareas.
- **ProtectedRoute**: Componente wrapper que verifica el estado de autenticación antes de renderizar rutas privadas, con estado de carga para evitar flickers.
- **Hooks personalizados**: `useAuth` y `useTasks` encapsulan lógica de negocio separada de la UI, facilitando el testing y la reutilización.
- **Estructura por capas**: `pages/`, `components/`, `services/`, `hooks/`, `types/` siguiendo separación de responsabilidades.

---

## 🧪 Testing

```bash
npm test            # Correr tests una vez
npm run test:watch  # Modo watch
```

**Cobertura actual:**
- `TodoForm.test.tsx` — 5 tests ✅
- `TodoList.test.tsx` — 3 tests ✅

---

## 🚀 Deploy en Vercel

1. Conectar el repositorio de GitHub en [vercel.com](https://vercel.com)
2. Configurar variables de entorno en Vercel Dashboard > Settings > Environment Variables
3. Vercel detecta automáticamente Vite y configura el build
4. Las Vercel Functions en `/api` se despliegan automáticamente

---

## 🤖 Uso de IA en el proceso de desarrollo

Durante el desarrollo utilicé IA (Antigravity / Gemini) como asistente en las siguientes situaciones:

- **Scaffolding inicial**: Generación de estructura de carpetas y configuración de dependencias.
- **Servicios de Firebase**: Generación de `taskService.ts` con operaciones Firestore y filtros por `userId`.
- **Vercel Function**: Generación del handler de AWS SES con validación de parámetros.
- **CSS Design System**: Generación del sistema de diseño dark-mode con variables CSS y animaciones.
- **Tests**: Generación de casos de prueba para `TodoForm` y `TodoList`.

**Patrones descubiertos:**
- La IA es especialmente efectiva para código boilerplate (configuración, tipos, servicios) donde la estructura es predecible.
- Para lógica de negocio crítica (filtros de seguridad, manejo de errores) es importante revisar cada línea generada.
- Los prompts más efectivos describían el contexto completo: stack, estructura existente y restricciones de seguridad.

---

## 📜 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo en localhost:5173 |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build de producción |
| `npm test` | Correr todos los tests |
| `npm run test:watch` | Tests en modo watch |
