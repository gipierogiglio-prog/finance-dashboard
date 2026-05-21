FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY --from=build /app/dist /app/html
EXPOSE 8000
CMD ["python3", "-m", "http.server", "8000", "-d", "/app/html"]