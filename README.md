# 📝 Parte Frontend – Todo App

Todo App es la interfaz de usuario, supervisor y administrador donde los diferentes miembros, según su usuario asignado, pueden administrar sus tareas de manera simple y dinámica.

Se conecta al backend mediante una API para mostrar tareas, asignaciones, estados y notificaciones, a través de un panel interactivo donde se puede ver el listado de tareas y descargar informes generales en archivo **.xlsx**.

---

## ⭐ Características Principales

- Panel intuitivo y dinámico  
- Vista Kanban *(Pendiente → En progreso → Completado)*  
- Gestión de usuarios desde el panel de admin:
  - Crear usuarios
  - Crear tareas personales *(no asignar a otros)*
- Supervisor:
  - Crear tareas y asignarlas a otros miembros del equipo  
- Usuario:
  - Crear tareas personales *(no asignarlas a otros)*  
- Actualización automática del estado de las tareas  
- Notificaciones visuales y en tiempo real  
- Generación y descarga de informes desde la interfaz  
- Integración completa con la API del backend  

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Vite + React  
- **Estilos:** CSS, Lucide React  
- **Construcción:** Vite  
- **Autenticación:** JWT  
- **Comunicación:** Fetch API  
- **Notificaciones:** SMTP  
- **Estado Global:** useState  
- **Despliegue:** Vercel  

---

## 📦 Instalación

### 1️⃣ Clonar el repositorio

Frontend:  
https://github.com/DG97-prog/TODOAPI-FrontEnd.git

### 2️⃣ Abrir en Visual Studio Code

Abrir la carpeta `TodoApp Main`.

### 3️⃣ Instalar dependencias

```bash
npm install
npm run dev

## 📦 Estructura del proyecto

TODO-APP/
│
├── node_modules/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TaskStats.jsx
│   │   └── UserAdmin.jsx
│   │
│   ├── services/
│   │   ├── apiService.js
│   │   └── mockService.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js

## Funcionalidades de la Interfaz
### Panel de Usuario

Lista de tareas asignadas

Total de tareas

Total por estado

## Vista Kanban

Estados:

Pendiente

En progreso

Completada

## Panel de Informes

Botón para descargar informes generados por el backend.

Los informes incluyen:

Total de tareas por estado

Tareas por usuario

Fecha de creación

Fecha de vencimiento

Gestión de Roles y Permisos

### Administrador

Acceso completo

Gestionar usuarios (crear, eliminar, actualizar)

Crear, editar y eliminar tareas personales

Recibir notificaciones por correo

### Supervisor

Acceso completo

Crear, editar y eliminar tareas personales

Asignar tareas a otros

Descargar informes globales en .xlsx

Recibir notificaciones

### Usuario

Acceso completo

Crear, editar y eliminar tareas personales

No puede modificar roles ni usuarios

Recibir notificaciones

 Herramientas Externas / Dependencias Adicionales

"name": "todo-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.511.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@tailwindcss/postcss": "^4.1.7",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.25.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "vite": "^6.3.5"