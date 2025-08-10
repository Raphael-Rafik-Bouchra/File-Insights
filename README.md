# File Insights

This is a web application built with Next.js that allows users to upload files, view AI-powered insights, and manage their files. It also includes an admin panel for user management.

## Features

### User Dashboard
- **Authentication**: Users can sign up and log in to their accounts.
- **File Upload**: Drag-and-drop or browse to upload files.
- **File Previews**: View thumbnails for image files directly in the file list.
- **File Management**: Search, filter by status, and sort files by name, size, or upload date.
- **AI Summaries**: View AI-generated summaries for processed files.
- **Dashboard Analytics**: A pie chart visualizes the breakdown of uploaded file types.

### Admin Panel
- **User Management**: Admins can view a list of all users.
- **Edit Users**: Update user information, including their role (admin/user) and status (active/inactive).
- **Delete Users**: Remove users from the system.
- **Separate Admin View**: A dedicated interface for administrative tasks.

## Tech Stack

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **AI Integration**: Genkit
- **Forms**: React Hook Form with Zod for validation
- **Charts**: Recharts

## Getting Started

To run the application locally, you'll need Node.js installed.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

## Test Credentials

Since this is a prototype, you can use the following credentials to test the different roles:

-   **Admin User**:
    -   **Email**: `admin@admin.com`
    -   **Password**: `AdminPass`

-   **Regular User**:
    -   You can register a new user through the sign-up page or use any credentials other than the admin's to log in.