# HairStyle Abii - Dockerfile (raiz del repo, para EasyPanel/DonWeb)
#
# Este Dockerfile vive en la raiz del repo HAIRSTYLE.
# EasyPanel construye con contexto = raiz del repo.
#
# La app sirve el frontend y las imagenes /fotos desde el filesystem
# (client/dist y client/public). Ambos se copian al contenedor.

# ---------- STAGE 1: compilar el frontend React (vite) ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY client/package*.json client/
RUN cd client && npm install
COPY client/ client/
RUN cd client && npm run build

# ---------- STAGE 2: runtime ----------
FROM node:20-alpine
WORKDIR /app

# Backend (server, ESM)
COPY server/package*.json server/
RUN cd server && npm install

COPY server/ server/
COPY client/public/ client/public/
COPY --from=build /app/client/dist/ client/dist/

ENV NODE_ENV=production
ENV PORT=3000
# La base la levanta EasyPanel; DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME
# (o DATABASE_URL) se inyectan como variables en el panel.

EXPOSE 3000
CMD ["node", "server/server.js"]
