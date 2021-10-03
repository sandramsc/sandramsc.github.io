#FROM is the base image for which we will run our application

FROM scratch

MAINTAINER sandra ashipala <sajustsmile@gmail.com>

COPY . .

LABEL org.opencontainers.image.source="https://github.com/sajustsmile/sajustsmile.github.io"
