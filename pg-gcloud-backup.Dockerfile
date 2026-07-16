FROM google/cloud-sdk:slim
RUN apt update && apt install -y postgresql-client && rm -rf /var/lib/apt/lists/*