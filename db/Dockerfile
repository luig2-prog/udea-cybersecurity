FROM mcr.microsoft.com/mssql/server:2022-preview-ubuntu-22.04

ENV ACCEPT_EULA=Y
ENV MSSQL_PID=Evaluation
ENV MSSQL_SA_PASSWORD=yourStrong#Password

COPY create-db.sql /usr/src/app/create-db.sql
COPY --chmod=0755 sqlserver-entrypoint.sh /usr/src/app/sqlserver-entrypoint.sh

EXPOSE 1433

ENTRYPOINT ["/usr/src/app/sqlserver-entrypoint.sh"]