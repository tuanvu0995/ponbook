services:
  postgres:
    container_name: postgres
    image: postgres:13
    volumes:
      - postgres_volume:/var/lib/postgresql/data
      - ./dockerConfig/postgres-dev-init.sql:/docker-entrypoint-initdb.d/init.sql # will setup dev database ponbook for us
    environment:
      POSTGRES_USER: vu
      POSTGRES_PASSWORD: toicoyeu7
    ports:
      - 5432:5432
