# Prueba técnica para el rol: Desarrollador FullStack Senior

## Objetivo: Se espera que el candidato implemente una solución al problema planteado tanto a nivel front como back con las siguientes consideraciones:

- El código debe estar alojado en un repositorio de GitHub

- El repositorio debe contener un documento que indique paso a paso como levantar el
proyecto y como ejecutar las pruebas.

- Se tiene un tiempo estimado de 3 días para la implementación de la prueba.
Funcionalidades requeridas:

1. Frontend con React (TypeScript)

- Una interfaz que permita ver, agregar, editar y eliminar dispositivos móviles.
- Para el CRUD los campos deben ser nombre, modelo y almacenamiento.
- Usa componentes funcionales y React Hooks.
- Consumir el API de https://randomuser.me y presentar: nombre, apellido, ciudad, pais y usuario como un header de la página

2. Backend con Node.js (TypeScript)

- Crea una API REST sencilla con un CRUD de tareas.
- Implementa al menos una validación básica en los datos.
- El CRUD debe almacenarse en un arreglo en memoria. (Deseable en MS SQL Server)

3. Pruebas unitarias con Jest

- Escribir pruebas unitarias para los componentes del frontend (React). (Es suficiente con un solo método)
- Pruebas unitarias para los endpoints del backend. (Es suficiente con un solo método)

4. Uso de Docker (deseable Kubernetes)
- Crea los archivos de configuración necesarios para que se despliegue tanto el frontend como el backend en diferentes contenedores.
- Los servicios deben estar configurados para interactuar entre sí.