FROM node:22-alpine AS builder

WORKDIR /build

COPY package*.json .

RUN npm install

COPY . ./

RUN npm run build --verbose


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package*.json ./package*.json
COPY --from=builder /build/dist/ ./dist

EXPOSE 4173

CMD [ "npm", "run", "preview" ]