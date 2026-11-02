# ponytail: Python 3.8 matches the 2020 pinned dependencies; move up with the upgrade planned in ROADMAP.md.
FROM python:3.8
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir /data && chown 65534 /data
USER 65534
ENV PYTHONDONTWRITEBYTECODE=1
CMD ["sh", "-c", "python manage.py migrate --noinput && exec daphne -b 0.0.0.0 -p 8000 times.asgi:application"]
