## Prerequisites: 
Before getting into dockerizing this application, please ensure that node and docker are installed on your machine.

## Steps to Dockerize this Route Planner Frontend ReactJS application

## Step 1:
Clone this git repository using the following command
bash
git clonehttps://github.com/Navriti-Technologies/form-builder-frontend.git

## Step 2: 
Move to the formbuilder-frontend-master
bash
cd formbuilder-frontend-master

## Project Structure:

At this point, the project structure should look like this.

![Project structure](https://media.geeksforgeeks.org/wp-content/uploads/20220615153215/dr3.png)

## Dockerfile for development:

At the root of our react project create a Dockerfile for the development phase. Let’s name it Dockerfile.dev.
bash
$ touch Dockerfile.dev

Paste the following commands into the newly created file:
bash
# Fetching the latest node image on alpine linux
FROM node:alpine AS development

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /react-app

# Installing dependencies
COPY ./package*.json /react-app

RUN npm install

# Copying all the files in our project
COPY . .

# Starting our application
CMD ["npm","start"]

Create a .dockerignore file to exclude unnecessary files thus speeding up the build process.
bash
node_modules
npm-debug.log
build
.git
*.md
.gitignore

Now, create a docker image by using the docker build command
bash
$ docker build -f Dockerfile.dev -t <name:tag> .

Here,
- -f : Path to the docker file
- -t : Name and tag for the image
- . : Context for the build process

This process will take some time and in the end, you will receive the id and tag of the newly created image.

![Docker build](https://media.geeksforgeeks.org/wp-content/uploads/20220612151032/w3-300x218.png)

Finally, create a docker container by running
bash
$ docker run -d -it –rm -p [host_port]:[container_port] –name [container_name] [image_id/image_tag]

Here,
- -d : Run container in background and print container ID
- -it : Create an interactive container
- -p : Map host port to container port
- -name : Assign a name to the container
- -rm : Automatically remove the container when it exits.

Verify whether the container has been created successfully by running
bash
$ docker container ps

![docker container ps](https://media.geeksforgeeks.org/wp-content/uploads/20220612153603/w8-300x84.png)

Run the application and navigate to http://localhost:3000/ (used port 3000 in this project and if you want to change, you can change the port in the .env file) in your browser to view the dockerized react app.

## Dockerfile for production:

Now, by looking into docker images you will find that our simple react application is taking up more than 500 MB of space. This is not suitable for deployment. So, we will now serve the react build files via a web server for better performance and load balancing.

We will use Nginx to serve our static files. So, firstly create an Nginx conf file in the root of our react application.
bash
$ touch nginx.conf

Paste the following content into the conf file.
bash
server {
 listen 80;
 
 location / {
   root /usr/share/nginx/html/;
   include /etc/nginx/mime.types;
   try_files $uri $uri/ /index.html;
 }
}

Here, we are telling our server to serve the index file from the root directory when a request is received on port 80.

Create a new Dockerfile for production mode.
bash
$ touch Dockerfile

Paste the following commands:
bash
# Fetching the latest node image on apline linux
FROM node:alpine AS builder

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./package.json ./
RUN npm install

# Copying all the files in our project
COPY . .

# Building our application
RUN npm run build

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

Now, repeat the same steps to build an image from our new Dockerfile and create a container out of it.
bash
$ docker build -t [name:tag] .
$ docker run -d -it –rm -p [host_port]:[container_port] –name [container_name] [image_id/image_tag]

![Docker build -f](https://media.geeksforgeeks.org/wp-content/uploads/20220612164900/w12-300x261.png)

Project Structure:

You should have the following structure at the end.

![Project Structure](https://media.geeksforgeeks.org/wp-content/uploads/20220615153214/dr4.png)

Run the application and navigate to “http://localhost/”  to verify the build process.

Now, we can observe that the size of our application has been reduced to less than 150MB
bash
$ docker images

![Docker Images](https://media.geeksforgeeks.org/wp-content/uploads/20220612164858/w15-300x29.png)

At this point, you have a packaged application running in its own isolated environment. But we are just halfway there. The container is still running on your local machine. Once your application is tested and ready to go, you'll need to ship that container.

There are several orchestration platforms like Kubernetes and Docker Swarm and cloud provides like Google, AWS, Azure, and others that make it possible. These are very useful when you want to deploy your application in different environments (dev, test, or production).