# ponytail: Node 12 matches Angular 9; move up with the upgrade planned in ROADMAP.md.
FROM node:12-bullseye AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build --prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist/ /usr/share/nginx/html/
