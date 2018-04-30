FROM node:8 

# create working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy package.json and lockfile
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

# install dependencies and pm2 (for running the server)
RUN npm install
RUN npm install pm2 -g

# copy all source and resources
COPY . /usr/src/app

# expose server port and run server
EXPOSE 8080
CMD ["pm2-docker", "--json", "server.js"]
