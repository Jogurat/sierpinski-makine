FROM node:14
# Create app directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install app dependencies
RUN npm install
# Copy all other files
COPY . .

# Start app
EXPOSE 7777
CMD [ "npm", "start" ]