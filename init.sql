IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'socials')
BEGIN
    CREATE DATABASE socials;
END
GO