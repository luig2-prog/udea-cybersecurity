#!/bin/bash
# Wait for SQL Server to be ready
echo "Waiting for SQL Server to start..."
sleep 30s # Adjust sleep time as necessary, or implement a more robust check

echo "Running create-db.sql..."
# Run the setup script to create the DB and table
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -d master -i /usr/src/app/create-db.sql
echo "Database initialization script finished."
