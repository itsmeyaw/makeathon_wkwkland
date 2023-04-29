FROM python:3.9.16-bullseye

COPY . /home
WORKDIR /home

RUN pip install -r requirements.txt

CMD ["python3", "wkwk_backend.py"]