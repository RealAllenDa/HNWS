FROM node:lts as builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM node:lts

WORKDIR /app

COPY --from=builder /app  .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000

CMD [ "npm", "start" ]
