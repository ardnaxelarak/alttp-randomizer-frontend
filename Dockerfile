FROM node:lts-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
COPY .docker-env .env
RUN npm run build

FROM nginx:stable-alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]
