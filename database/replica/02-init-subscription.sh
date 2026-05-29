#!/bin/bash
set -e

# We wrap the logic in a function to run it as a background job
setup_replication() {
  set +e # Prevent the background worker from failing silently

  echo "[Replication Setup] Waiting for Postgres initialization to finish..."
  # Wait until PID 1 is 'postgres' (meaning docker-entrypoint finished and exec'd postgres)
  while [ "$(ps -o comm= -p 1)" != "postgres" ]; do
    sleep 2
  done

  echo "[Replication Setup] Waiting for local replica database to be ready..."
  until pg_isready -h "127.0.0.1" -p 5432 -U "$REPLICA_USER"; do
    sleep 2
  done

  echo "[Replication Setup] Waiting for publisher to be ready ($PUBLISHER_HOST:$PUBLISHER_PORT)..."
  until pg_isready -h "$PUBLISHER_HOST" -p "$PUBLISHER_PORT" -U "$PUBLISHER_USER"; do
    sleep 5
  done

  echo "[Replication Setup] Waiting for the Microservice API to run its migrations (checking for 'user' table)..."
  until PGPASSWORD=$PUBLISHER_PASSWORD psql -h "$PUBLISHER_HOST" -p "$PUBLISHER_PORT" -U "$PUBLISHER_USER" -d "$PUBLISHER_DB" -c "\d \"$PUBLISHER_MAIN_TABLE\"" > /dev/null 2>&1; do
    echo "[Replication Setup] Table 'user' not found in publisher. Waiting 5s..."
    sleep 5
  done

  echo "[Replication Setup] Checking if subscription exists..."
  SUB_EXISTS=$(psql -h "127.0.0.1" -U "$REPLICA_USER" -d "$REPLICA_DB" -tAc "SELECT 1 FROM pg_subscription WHERE subname = '${SUBSCRIPTION_NAME}';" || echo "0")

  if [ "$SUB_EXISTS" != "1" ]; then
    echo "[Replication Setup] Dumping schema + data from publisher..."
    PGPASSWORD=$PUBLISHER_PASSWORD pg_dump \
      -h "$PUBLISHER_HOST" -p "$PUBLISHER_PORT" -U "$PUBLISHER_USER" "$PUBLISHER_DB" \
      | psql -h "127.0.0.1" -U "$REPLICA_USER" -d "$REPLICA_DB"

    echo "[Replication Setup] Creating subscription..."
    psql -h "127.0.0.1" -U "$REPLICA_USER" -d "$REPLICA_DB" <<SQL
CREATE SUBSCRIPTION ${SUBSCRIPTION_NAME}
  CONNECTION 'host=${PUBLISHER_HOST} port=${PUBLISHER_PORT} dbname=${PUBLISHER_DB} user=${REPLICATION_USER} password=${REPLICATION_PASSWORD}'
  PUBLICATION ${PUBLICATION_NAME}
  WITH (copy_data = false);
SQL

    echo "[Replication Setup] Subscription created successfully!"
  else
    echo "[Replication Setup] Subscription already exists."
  fi
}

echo "Starting async replication setup in background..."
setup_replication &
disown
