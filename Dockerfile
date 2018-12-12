FROM node:6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN cd /usr/src/app/
RUN npm install --save

EXPOSE 9090
CMD [ "npm", "start" ]