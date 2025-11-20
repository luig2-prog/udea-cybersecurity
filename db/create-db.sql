IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'TasksDB')
BEGIN
  CREATE DATABASE TasksDB;
    PRINT 'TasksDB database created.';
END
ELSE
BEGIN
    PRINT 'TasksDB database already exists.';
END
GO

USE TasksDB;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tasks')
BEGIN
  CREATE TABLE Tasks (
    id NVARCHAR(50) PRIMARY KEY,
    title NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    completed BIT NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT GETDATE()
  );
  PRINT 'Tasks table created in TasksDB.';
END
ELSE
BEGIN
  PRINT 'Tasks table already exists in TasksDB.';
END
GO
