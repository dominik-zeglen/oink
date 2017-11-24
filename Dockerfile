FROM node:8.9-slim
ENV MONGODB_PATH mongodb://localhost:27017/oink

ADD ./package.json /app/
ADD ./package-lock.json /app/
ADD ./dist /app/
ADD ./templates /app/
ADD ./wait-for-it.sh /app/

WORKDIR /app

RUN chmod u+x ./wait-for-it.sh
RUN npm i --only=production

EXPOSE 8000
ENV PORT 8000

