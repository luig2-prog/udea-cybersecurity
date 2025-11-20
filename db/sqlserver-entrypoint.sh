#!/bin/bash
set -e

/opt/mssql/bin/sqlservr &
SQL_SERVER_PID=$!

echo "SQLSERVER_ENTRYPOINT: Waiting for SQL Server to start..."
until /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -Q "SELECT 1" &>/dev/null; do
  echo "SQLSERVER_ENTRYPOINT: SQL Server is unavailable - sleeping"
  sleep 5
done
echo "SQLSERVER_ENTRYPOINT: SQL Server is up - executing initialization script"

/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -d master -i /usr/src/app/create-db.sql
echo "SQLSERVER_ENTRYPOINT: Initialization script executed."

wait $SQL_SERVER_PID
