FROM node:18.14 as frontend
WORKDIR /build
COPY ./frontend/package.json ./frontend/vite.config.ts ./frontend/tsconfig.* ./frontend/env.d.ts ./frontend/index.html ./
COPY ./frontend/public ./
COPY ./frontend/src ./src
RUN yarn install --production=false && NODE_ENV=production yarn build --outDir=/dist


FROM python:3.10

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	postgresql-client \
	&& rm -rf /var/lib/apt/lists/* \
	&& pip3 install poetry

WORKDIR /app
COPY --from=frontend /build/dist ./frontend-dist

WORKDIR /app/backend
COPY ./backend/manage.py* ./backend/pyproject.toml* ./
COPY ./backend/numnum ./numnum
COPY ./backend/apps ./apps

RUN poetry config virtualenvs.create false \
 && poetry install

EXPOSE 8000
CMD ["/bin/bash", "-c", "python manage.py collectstatic --noinput; gunicorn --bind :8000 --workers 1 numnum.wsgi"]
