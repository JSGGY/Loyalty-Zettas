FROM node:20.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build # Comando para compilar los archivos TypeScript

EXPOSE 3000

CMD ["npm", "run", "start"]
