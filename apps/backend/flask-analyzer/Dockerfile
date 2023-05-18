# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN pip3 install essentia-tensorflow

COPY . .
RUN mkdir -p uploads

ENV FLASK_DEBUG True

CMD ["python3", "-m" , "flask", "--app", "src", "run", "--host=0.0.0.0"]
