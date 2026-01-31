# AI Agents Platform API

API REST construida en **NestJS + TypeScript + MySQL** para la generación, gestión y trazabilidad de agentes de IA a gran escala. Este proyecto corresponde a una **prueba técnica backend** e incluye todos los requisitos base y varios **bonus**.

---

## Objetivo

Diseñar un sistema escalable que permita:

* Generar agentes IA de forma masiva y aleatoria
* Clasificarlos por categorías
* Asignar atributos dinámicos a cada agente
* Mantener trazabilidad de cada proceso de generación
* Consultar y filtrar eficientemente grandes volúmenes de datos

---

## Stack Tecnológico

* **Node.js 20**
* **NestJS**
* **TypeScript**
* **MySQL 8**
* **TypeORM**
* **Docker & Docker Compose**
* **Swagger**
* **Jest + Supertest** (tests E2E)

---

## Estructura del Proyecto

```
.
├── database/
│   └── schema.sql              # Script SQL con CREATE TABLE
├── src/
│   ├── agents/                 
│   ├── agent-attributes/       
│   ├── categories/             
│   ├── generation-logs/        
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── agents.e2e-spec.ts      
│   └── jest-e2e.json
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Configuración y Ejecución

### Prerequisitos

- Node.js 20+
- Docker & Docker Compose 
- MySQL 8+ 

### Opción 1: Docker 

1. **Clonar el repositorio**

```bash
git clone <tu-repositorio>
cd ai-agents-platform
```

2. **Configurar variables de entorno**

```bash
cp .env.example .env
```

**Contenido de `.env` para Docker:**

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=ai_agents
PORT=3000
```

3. **Levantar los servicios**

```bash
docker-compose up --build
```

Esto levanta:
- API NestJS en `http://localhost:3000`
- MySQL en puerto `3307` (mapeado desde el contenedor)
- Swagger UI en `http://localhost:3000/docs`


### Opción 2: Ejecución Local

1. **Instalar dependencias**

```bash
npm install
```

2. **Configurar variables de entorno**

```bash
cp .env.example .env
```

**Contenido de `.env` para local:**

```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=your_user
DB_PASSWORD= your_password
DB_NAME=ai_agents
PORT=3000
```

3. **Ejecutar la aplicación**

```bash
npm run start:dev
```

---

## 🧪 Cómo Probar los Endpoints

### Opción 1: Swagger UI

Visita `http://localhost:3000/docs` y prueba directamente desde la interfaz interactiva.

### Opción 2: cURL

#### 1. **Crear una categoría**

```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Doméstico",
    "description": "Agentes para tareas del hogar"
  }'
```

#### 2. **Listar categorías**

```bash
curl "http://localhost:3000/categories?limit=10&offset=0"
```

#### 3. **Generar agentes de forma masiva**

```bash
curl -X POST http://localhost:3000/agents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "quantity": 100,
    "seed": "test-seed-123"
  }'
```

#### 4. **Listar agentes con filtros**

```bash
# Por categoría
curl "http://localhost:3000/agents?categoryId=1&limit=10&offset=0"

# Por estado
curl "http://localhost:3000/agents?status=active&limit=10"

# Por nombre (búsqueda parcial con LIKE)
curl "http://localhost:3000/agents?name=Agent-12&limit=10"

# Combinado
curl "http://localhost:3000/agents?categoryId=1&status=active&limit=20&offset=0"
```

#### 5. **Ver detalle de un agente**

```bash
curl http://localhost:3000/agents/1
```

#### 6. **Actualizar un agente**

```bash
curl -X PATCH http://localhost:3000/agents/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

#### 7. **Agregar atributos dinámicos a un agente**

```bash
curl -X POST http://localhost:3000/agents/1/attributes \
  -H "Content-Type: application/json" \
  -d '{
    "key": "efficiency",
    "value": "95%"
  }'
```

#### 8. **Listar atributos de un agente**

```bash
curl http://localhost:3000/agents/1/attributes
```

#### 9. **Actualizar un atributo**

```bash
curl -X PATCH http://localhost:3000/agents/1/attributes/efficiency \
  -H "Content-Type: application/json" \
  -d '{
    "value": "98%"
  }'
```

#### 10. **Ver logs de generación**

```bash
# Todos los logs
curl http://localhost:3000/generation-logs

# Solo completados
curl "http://localhost:3000/generation-logs?status=completed"

# Solo fallidos
curl "http://localhost:3000/generation-logs?status=failed"
```

---

## Modelo Relacional (MySQL)

### Entidades Principales

#### **categories**
- Clasificación lógica de los agentes
- `UNIQUE` constraint en `name`
- Índice `idx_category_name` para búsquedas rápidas


#### **agents**
- Representa cada agente IA generado
- Relacionado con `categories` y `generation_logs`
- Índices compuestos para queries frecuentes


#### **agent_attributes**
- Atributos dinámicos (key-value) para extender agentes
- Sin modificar el schema principal
- `UNIQUE(agent_id, attr_key)` asegura consistencia

#### **generation_logs**
- Auditoría de cada ejecución de generación
- Guarda cantidad, seed, estado y errores
- Permite trazabilidad y reproducibilidad

---

## Decisiones Técnicas

### ¿Por qué este diseño escala?

1. **Índices estratégicos**: Todas las queries frecuentes tienen índices compuestos
   - Filtrado por categoría + estado: `idx_agents_category_status`
   - Búsqueda de atributos: `idx_attr_agent_key`
   - Logs ordenados por fecha: `idx_gen_status_created`

2. **Normalización 3FN**: Evita redundancia sin sacrificar rendimiento
   - Categorías separadas (reusables)
   - Atributos dinámicos (schema-less, permite extender sin migrations)

3. **Batch inserts**: TypeORM permite `save(array)` que ejecuta inserts masivos en una sola query

4. **Paginación obligatoria**: Limita carga en memoria y mejora tiempos de respuesta

### ¿Cómo se asegura consistencia e integridad?

1. **Foreign Keys**: Integridad referencial garantizada por MySQL
   - `agents.category_id` → `categories.id`
   - `agents.generation_log_id` → `generation_logs.id`
   - `agent_attributes.agent_id` → `agents.id`

2. **Transacciones**: Generación atómica 
   - Si falla la creación de agentes, el log se marca como `FAILED`
   - Rollback automático en caso de error

3. **UNIQUE constraints**: `(agent_id, attr_key)` evita duplicados en atributos

4. **ON DELETE CASCADE**: Limpieza automática de atributos cuando se elimina un agente 

### Consultas optimizadas por índices

```sql
-- Buscar agentes por categoría y estado (usa idx_agents_category_status)

-- Buscar atributos de un agente (usa idx_attr_agent_key)

-- Logs recientes fallidos (usa idx_gen_status_created)
```

## Reproducibilidad mediante Seed

El endpoint de generación de agentes soporta un parámetro opcional **`seed`**, el cual permite reproducir la misma generación lógica en múltiples ejecuciones.

**Ejemplo:**

```bash
# Primera ejecución
curl -X POST http://localhost:3000/agents/generate \
  -d '{"categoryId": 1, "quantity": 10, "seed": "my-seed-123"}'

# Segunda ejecución (genera los mismos nombres)
curl -X POST http://localhost:3000/agents/generate \
  -d '{"categoryId": 1, "quantity": 10, "seed": "my-seed-123"}'
```

El valor del seed:
- Se almacena en `generation_logs.seed`
- Permite auditar cómo se generó un conjunto de agentes
- Facilita debugging y pruebas determinísticas
- Usa la librería `seedrandom` para generación pseudoaleatoria controlada

---

## Tests

El proyecto incluye tests **end-to-end (E2E)** utilizando **Jest + Supertest**, enfocados en validar los flujos principales sobre la aplicación real.

### Tests actuales:

- Generación de agentes `(POST /agents/generate)`
- Listado paginado de agentes `(GET /agents)`

Los tests levantan el `AppModule` completo, asegurando que la integración entre controladores, servicios y base de datos funciona correctamente.

### Ejecutar tests:

```bash
# Tests E2E
npm run test:e2e

```
---

## 📊 Bonus Implementados

| Feature | Estado | Descripción |
|---------|--------|-------------|
| Docker & docker-compose | ✅ | Levantar todo con un solo comando |
| Seed para reproducibilidad | ✅ | Generación determinística con `seedrandom` |
| Auditoría de generación | ✅ | Tabla `generation_logs` con estado y errores |
| Swagger | ✅ | Documentación interactiva en `/docs` |
| Índices optimizados | ✅ | Compuestos para queries frecuentes |
| Tests E2E | ✅ | Jest + Supertest para flujos clave |

---

## Documentación de la API

### Swagger UI

La documentación completa está disponible en:

```
http://localhost:3000/docs
```

Incluye:
- Descripción de todos los endpoints
- Schemas de request/response
- Validaciones
- Ejemplos interactivos

### Endpoints principales

#### **Categories**
- `POST /categories` - Crear categoría
- `GET /categories` - Listar con paginación
- `GET /categories/:id` - Detalle
- `PATCH /categories/:id` - Actualizar
- `DELETE /categories/:id` - Eliminar

#### **Agents**
- `POST /agents/generate` - Generar N agentes
- `GET /agents` - Listar con filtros (categoryId, status, name)
- `GET /agents/:id` - Detalle
- `PATCH /agents/:id` - Actualizar status/nombre

#### **Agent Attributes**
- `POST /agents/:id/attributes` - Crear atributo
- `GET /agents/:id/attributes` - Listar
- `PATCH /agents/:id/attributes/:key` - Actualizar
- `DELETE /agents/:id/attributes/:key` - Eliminar

#### **Generation Logs**
- `GET /generation-logs` - Listar historial
- `GET /generation-logs?status=completed` - Filtrar por estado

---
```
```

## Conclusión

El sistema está diseñado para **crecer en volumen** sin comprometer **consistencia** ni **rendimiento**, manteniendo una API clara, documentada y fácil de probar.


