FROM google/cloud-sdk:slim

# https://wiki.postgresql.org/wiki/Apt
RUN apt update \
  && apt install -y postgresql-common ca-certificates \
  && yes | /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh \
  && apt update && apt install -y postgresql-client-18 \
  && rm -rf /var/lib/apt/lists/*