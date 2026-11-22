# Node 20 from the reference pattern reaches end of support in April 2026;
# this project uses Node 22 for the build stage.
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
# npm ci is the npm-native strict lockfile install; --frozen-lockfile is not an npm flag.
RUN npm ci
ARG VITE_API_URL=/api
ARG VITE_USE_MOCK=false
# VITE_* values are baked into the browser bundle during this build.
ARG VITE_SHOW_DEMO_ACCOUNTS=false
ENV VITE_API_URL=$VITE_API_URL VITE_USE_MOCK=$VITE_USE_MOCK VITE_SHOW_DEMO_ACCOUNTS=$VITE_SHOW_DEMO_ACCOUNTS
COPY . .
RUN npm run build
FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
