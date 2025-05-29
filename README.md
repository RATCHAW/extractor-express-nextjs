# AI-Powered Data Extraction Platform

An intelligent document processing application that uses AI to extract structured data from various file formats. Built with Next.js, Express.js, and Google Gemini AI in a modern Turborepo monorepo structure.

## 🚀 Features

- **AI-Powered Extraction**: Leverages Google Gemini 2.0 Flash model for intelligent document parsing
- **Multi-Format Support**: Process PDFs, images, and various document types
- **Custom Field Definition**: Define exactly what data you want to extract with descriptions
- **Credit System**: Built-in usage tracking with daily credit resets
- **Multiple Export Formats**: Export extracted data as CSV, JSON, or Excel

## 🛠️ Tech Stack

### Frontend (`apps/web`)

- **Next.js 15** with App Router and Turbopack
- **Shadcn UI** for components
- **TanStack Query** for data fetching
- **React Hook Form** with Zod validation

### Backend (`apps/api`)

- **Express.js** with TypeScript
- **AI SDK** (Gemini 2.0 Flash)
- **Better Auth** for authentication
- **Prisma ORM** for database management
- **Zod** for schema validation

### Infrastructure

- **Docker** containerization
- **GitHub Actions** CI/CD
- **Turborepo** monorepo management
- **pnpm** package manager

## 📦 Project Structure

```
apps/
├── web/          # Next.js frontend application
├── api/          # Express.js backend API
packages/
├── @repo/db      # Prisma database schema and client
├── @repo/schemas # Shared Zod validation schemas
├── @repo/eslint-config    # Shared ESLint configuration
└── @repo/typescript-config # Shared TypeScript configuration
```
