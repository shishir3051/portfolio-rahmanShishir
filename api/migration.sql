-- Create Projects table
CREATE TABLE Projects (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Tag VARCHAR(80),
    Description TEXT,
    ProjectYear VARCHAR(10),
    Role VARCHAR(120),
    TechCsv TEXT,
    DetailsJson TEXT,
    LiveUrl VARCHAR(500),
    RepoUrl VARCHAR(500),
    SortOrder INT DEFAULT 0,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ContactMessages table
CREATE TABLE ContactMessages (
    Id SERIAL PRIMARY KEY,
    FullName VARCHAR(120) NOT NULL,
    Email VARCHAR(254) NOT NULL,
    Message TEXT NOT NULL,
    IpAddress VARCHAR(64),
    UserAgent TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create BlogPosts table
CREATE TABLE BlogPosts (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Excerpt TEXT,
    Content TEXT,
    Category VARCHAR(100),
    ReadTime VARCHAR(50),
    Featured BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Admins table
CREATE TABLE Admins (
    Id SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash TEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
