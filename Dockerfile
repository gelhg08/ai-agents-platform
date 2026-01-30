FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto de Nest
EXPOSE 3000

# Ejecutar la app
CMD ["npm", "run", "start:prod"]
