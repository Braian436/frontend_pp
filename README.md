# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## API de backend

La aplicación usa `http://localhost:8000/api` de forma predeterminada. Se puede
configurar otra URL base con `VITE_API_URL` (por ejemplo,
`VITE_API_URL=http://localhost:8000/api`).

El inicio de sesión usa `/auth/token/` y `/auth/me/`, y la salida usa
`/auth/logout/`; el token vive solo en memoria, por lo que hay que volver a
iniciar sesión al recargar la página. Las rutas disponibles en el panel son `/empleados/`, `/liquidaciones/`,
`/turnos/disponibilidad/` y `/turnos/reservas/`. Clientes, servicios, ventas,
cajas, movimientos de caja y productos/stock se muestran como pendientes hasta
que exista su API. Los menús por grupo son solo navegación: Django debe validar
los permisos de cada petición.

## Verificación

- `npm test`
- `npm run lint`
- `npm run build`

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
