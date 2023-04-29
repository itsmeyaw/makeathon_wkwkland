FROM python:3.9.16-bullseye

COPY . /home
WORKDIR /home

RUN apt-get update
RUN apt-get install -y texlive vim
RUN pip install -r requirements.txt

CMD ["python3", "wkwk_backend.py"]