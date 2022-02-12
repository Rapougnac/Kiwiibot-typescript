FROM node:16.13-bullseye

WORKDIR /

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install pnpm -g
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]