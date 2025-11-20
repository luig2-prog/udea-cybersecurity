# Mobile Device Manager

## Prueba técnica Iuvity - Desarrollador FullStack Senior

Este proyecto implementa una aplicación web implementa lo siguiente:

## Características y Funcionalidades

### Frontend

- **Gestión de dispositivos móviles**: Permite realizar un CRUD sobre dispositivos móviles almacenados en memoría, mostrando información como nombre, modelo y almacenamiento.
- **Consumo API RamdomUser**: Integra la API RandomUser para mostrar información de usuario en el encabezado.

### Backend

- **API REST sencilla**: Endpoints para operaciones CRUD de tareas. Puedes importar las peticiones en potman [postman_collection.json](/postman_collection.json)
- **Validación de Datos**: Validación de entrada para garantizar la integridad de los datos.
- **Almacenamiento en MS SQL Server**: Implementación de una BD en docker con la imagen de docker [Docker Hub - Microsoft SQL Server - Ubuntu based images](https://hub.docker.com/r/microsoft/mssql-server).
- **Arquitectura Modular**: Separación en controladores, modelos, rutas.

### Despliegue

- **Dockerización**: Contenedores para backend y frontend.
- **Docker Compose**: Configuración para ejecutar múltiples contenedores.
- **Kubernetes**: Manifiestos para despliegue en entornos de Kubernetes.

## 🚀 Cómo Poner a Correr Este Asunto (Paso a Paso)

¡Qué onda! Si quieres ver esta maravilla en acción, aquí te va la receta.

### Lo que necesitas tener a la mano:

- **Docker y Docker Compose**: Pa' los contenedores, ya sabes.
- **Node.js y npm (o yarn)**: Para manejar las dependencias y correr scripts.
- **kubectl**: La varita mágica para Kubernetes.
- **Kind**: Si quieres montar tu propio mini Kubernetes en tu máquina. Si ya tienes otro K8s, ¡adelante!
- **Tu editor de código favorito**: ¡El que te haga feliz!
- **Git**: Para clonar este repo, obvio.

### 🛠️ Preparando el Terreno (Configuración Inicial)

1.  **Clona el Repositorio**:

```bash
git clone https://github.com/luig2-prog/iuvity.git
cd iuvity
```

2.  **El Archivo `.env` del Backend**:
    - En la carpeta `backend/`, haz una copia de `.env.example` y llámala `.env`.
    - Abre `backend/.env` y revisa la `DB_PASSWORD`. La que está (`yourStrong#Password`) tiene un `#`. Si te da problemas, ponla entre comillas simples: `DB_PASSWORD='yourStrong#Password'`. Esto es clave para que conecte a la base de datos MS SQL Server.
    - Las otras variables (`DB_HOST=localhost`, `DB_USER=sa`, `DB_NAME=TasksDB`, `DB_PORT=1433`) deberían funcionar bien para el modo Docker Compose.

### Opción 1: Docker Compose

Esta es la forma más sencilla de levantarlo todo.

1.  **Desde la raíz del proyecto, ejecuta**:

```bash
docker compose up --build
```

Esto construirá las imágenes (si es la primera vez o hay cambios) y levantará los servicios:

- **Frontend**: Accesible en `http://localhost:80`
- **Backend**: API escuchando en `http://localhost:3001`
  Puedes importar a postman para que pruebes el archivo: [postman_collection.json](/postman_collection.json)
- **Base de Datos**: MS SQL Server corriendo y lista.

2.  **Para detener todo**:
    Presiona `Ctrl + C` en la terminal donde corriste `docker compose up`, y luego:

```bash
docker compose down
```

Si quieres borrar también los volúmenes (como los datos de la BD):

```bash
docker compose down -v
```

### Opción 2: Modo Kubernetes (Si te sientes aventurero)

Aquí usamos Kind para un clúster local. Si ya tienes un clúster K8s, adapta los pasos.

1.  **Construye las Imágenes Docker**:
    (Si Docker te pide permisos, antepón `sudo` a estos comandos)

```bash
docker build -t iuvity-mssql-server:latest ./db
docker build -t iuvity-backend:latest ./backend
docker build -t iuvity-frontend:latest ./frontend
```

2.  **Crea un Clúster Kind (si aún no tienes uno)**:
    (El `README.md` original usa `iuvity-cluster` como nombre, ¡sigamos con ese!)

```bash
# Validar si tienes un cluster
kind get clusters
# Si no existe, crearlo
kind create cluster --name iuvity-cluster --config kind-config.yaml
```

3.  **Carga las Imágenes al Clúster Kind**:
    (De nuevo, `sudo` si es necesario)

```bash
kind load docker-image iuvity-mssql-server:latest --name iuvity-cluster
kind load docker-image iuvity-backend:latest --name iuvity-cluster
kind load docker-image iuvity-frontend:latest --name iuvity-cluster
```

4.  **Aplica los Manifiestos de Kubernetes (¡en este orden!)**:
    (Y sí, `sudo kubectl` si `kubectl` solo no jala por permisos)

- **Base de Datos**:

```bash
kubectl apply -f kubernetes/ms-sql-server-deployment.yaml
kubectl logs -f deployment/mssql-deployment
```

- **Backend**:

```bash
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl logs -f deployment/iuvity-backend
```

- **Frontend**:

```bash
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl logs -f deployment/iuvity-frontend
```

5.  **Accede a la Aplicación**:
    Para exponer el frontend, usa `port-forward`. Deja este comando corriendo en una terminal:

```bash
kubectl port-forward service/iuvity-frontend-service 8080:80
```

    Luego, abre tu navegador y ve a `http://localhost:8080`.

6.  **Limpiando el Chiquero (Borrar todo de Kubernetes)**:
    Cuando termines de probar:

```bash
kubectl delete -f kubernetes/frontend-deployment.yaml --ignore-not-found=true
kubectl delete -f kubernetes/backend-deployment.yaml --ignore-not-found=true
kubectl delete -f kubernetes/ms-sql-server-deployment.yaml --ignore-not-found=true
```

Si también quieres borrar los datos persistentes de la base de datos:

```bash
kubectl delete pvc mssql-data-pvc --ignore-not-found=true
```

Y si creaste un clúster Kind solo para esto, puedes borrarlo:

```bash
kind delete cluster --name iuvity-cluster
```

### ✅ Probando que Todo Esté en Orden (Tests Unitarios)

No olvides correr las pruebas para asegurar que todo funcione como se espera.

- **Pruebas del Backend**:

  1.  Navega a la carpeta `backend/`.
  2.  Asegúrate de tener el archivo `.env` configurado correctamente (como se explicó en "Preparando el Terreno").
  3.  Instala dependencias: `npm install` (o `yarn install`).
  4.  Corre las pruebas: `npm test` (o `yarn test`). Todas deberían pasar.

```bash
cd backend
npm test
```

- **Pruebas del Frontend**:

  1.  Navega a la carpeta `frontend/`.
  2.  Instala dependencias: `npm install` (o `yarn install`).
  3.  Corre las pruebas: `npm test` (o `yarn test`). Deberían pasar.

```bash
cd frontend
npm test
```

## Tecnologías Utilizadas

Tecnologías usadas

- **Backend:** Node.js con TypeScript, Express
- **Frontend:** React con TypeScript, Hooks
- **Almacenamiento:** BD - MS SQL Server, LocalStorage (frontend)
- **Estilos:** TailwindCSS
- **Testing:** Jest
- **Containerización:** Docker y Kubernetes
