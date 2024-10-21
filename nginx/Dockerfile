FROM nginx:latest

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# Copy the static site content
COPY ./dist-* .

# Copy the nginx configuration
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy the SSL certificates
COPY ./certs/server.crt /etc/nginx/certs/server.crt
COPY ./certs/server.key /etc/nginx/certs/server.key