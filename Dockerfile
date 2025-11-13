# Dockerfile
FROM node:20-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# Prisma CLIをグローバルにインストール
RUN npm install -g prisma

# アプリケーションのソースをコピー
COPY . .

# Prisma Clientを生成
RUN npx prisma generate

# 開発サーバーのポートを公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]

