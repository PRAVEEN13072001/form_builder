FROM node:16
WORKDIR /app/frontend 
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build
FROM nginx:alpine
COPY --from=0 /usr/src/app/build /usr/share/nginx/html
 EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]