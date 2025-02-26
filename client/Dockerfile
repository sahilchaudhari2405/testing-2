# Step 1: Build the frontend
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Step 2: Serve build files using a lightweight HTTP server
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
