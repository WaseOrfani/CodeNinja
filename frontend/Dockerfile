# Frontend Dockerfile für AfghanFood.de
# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build
COPY . .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN yarn build

# Production Stage
FROM nginx:alpine

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
