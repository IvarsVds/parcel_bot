FROM node:current AS builder
WORKDIR /opt/parcel_bot/
COPY . .
RUN npm install
RUN npm run build

FROM node:current
WORKDIR /opt/parcel_bot/
COPY --from=builder /opt/parcel_bot/build/* build/
COPY package*.json settings.env start.sh ./
RUN apt-get update && apt-get install curl -y
RUN npm ci --only=production
RUN groupadd -r parcelbot && useradd -r -g parcelbot parcelbot
RUN chmod +x ./start.sh
CMD ["./start.sh"]