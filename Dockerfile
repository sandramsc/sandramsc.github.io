#FROM is the base image for which we will run our application

FROM scratch

MAINTAINER sandra ashipala <sajustsmile@gmail.com>

COPY . .

LABEL org.opencontainers.image.source="https://github.com/sajustsmile/sajustsmile.github.io"

ADD requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

RUN 

EXPOSE 5500

CMD ["echo", "Team Blue Marble hackathon project..."]