
FROM node:20 AS build-stage
WORKDIR /app

ARG API_HOST=localhost
ENV VITE_API_HOST=$API_HOST

COPY ./package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

FROM nginx:alpine AS production-stage
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 5173
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
