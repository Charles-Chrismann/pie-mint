# -------- STAGE DEV --------
FROM node:22-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# -------- STAGE PROD --------
FROM nginx:alpine AS prod

# Nettoyer les fichiers Nginx par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copier le build local
COPY dist/ /usr/share/nginx/html

# Copier le template env.js
COPY env.template.js /usr/share/nginx/html/env.template.js

# Copier la config NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le script de démarrage
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
