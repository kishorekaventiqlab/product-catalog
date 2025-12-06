# Serverless Product Catalog App – End-to-End CI/CD on AWS

[![AWS](https://img.shields.io/badge/AWS-Cloud-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Automated-blue)](https://aws.amazon.com/codepipeline/)
[![Serverless](https://img.shields.io/badge/Architecture-Serverless-green)](https://aws.amazon.com/lambda/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive training project demonstrating enterprise-grade DevOps practices using AWS native services. This serverless product catalog application showcases a complete CI/CD pipeline with automated deployments, infrastructure as code, and multi-stage notification systems.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [AWS Services Used](#aws-services-used)
- [Repository Structure](#repository-structure)
- [CI/CD Pipeline Flow](#cicd-pipeline-flow)
- [Notification System](#notification-system)
- [Prerequisites](#prerequisites)
- [Deployment Instructions](#deployment-instructions)
- [Build & Deploy Configuration](#build--deploy-configuration)
- [Testing the Application](#testing-the-application)
- [Troubleshooting](#troubleshooting)
- [Cost Estimate](#cost-estimate)
- [Cleanup Guide](#cleanup-guide)
- [Credits](#credits)

---

## 🎯 Project Overview

### What This Project Does

The **Serverless Product Catalog Application** is a full-stack cloud-native solution that enables users to manage product inventory through a RESTful API. The application demonstrates real-world DevOps practices by implementing:

- **Backend**: AWS Lambda functions providing CRUD operations
- **Database**: DynamoDB for scalable, serverless data storage
- **API**: API Gateway exposing RESTful endpoints
- **Frontend**: Static website hosted on S3
- **Infrastructure**: CloudFormation templates for reproducible deployments
- **CI/CD**: Fully automated pipeline from code commit to production
- **Notifications**: Real-time alerts at every pipeline stage

### Purpose

This project serves as a hands-on training platform for:
- AWS DevOps services integration
- Serverless architecture patterns
- Infrastructure as Code (IaC) best practices
- Automated testing and deployment strategies
- Multi-stage notification and monitoring systems

### Key Learning Objectives

- Build and deploy serverless applications on AWS
- Implement end-to-end CI/CD pipelines using native AWS services
- Manage package dependencies with CodeArtifact
- Configure multi-stage notification systems with SNS
- Apply Infrastructure as Code principles with CloudFormation
- Monitor and troubleshoot production deployments
- Implement security best practices with IAM roles and policies

---

## 🏗️ Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CI/CD PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────┐      ┌──────────────┐      ┌───────────┐      ┌──────────┐ │
│  │ GitHub │─────▶│ CodePipeline │─────▶│ CodeBuild │─────▶│CodeDeploy│ │
│  └────────┘      └──────┬───────┘      └─────┬─────┘      └────┬─────┘ │
│      │                  │                     │                  │       │
│      │                  │                     │                  │       │
│      │                  ▼                     ▼                  ▼       │
│      │            ┌──────────┐         ┌─────────────┐    ┌─────────┐  │
│      │            │   SNS    │◀────────│CodeArtifact │    │CloudForm│  │
│      │            │ Alerts   │         │  (packages) │    │  ation  │  │
│      │            └──────────┘         └─────────────┘    └─────────┘  │
│      │                  │                                                │
└──────┼──────────────────┼────────────────────────────────────────────────┘
       │                  │
       ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       APPLICATION RUNTIME                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌──────────┐          ┌────────────┐          ┌──────────┐           │
│   │    S3    │          │    API     │          │  Lambda  │           │
│   │ Frontend │◀────────▶│  Gateway   │◀────────▶│ Functions│           │
│   └──────────┘          └────────────┘          └────┬─────┘           │
│   (Static Web)          (REST API)                   │                  │
│                                                       ▼                  │
│                                              ┌─────────────┐            │
│                                              │  DynamoDB   │            │
│                                              │   Tables    │            │
│                                              └─────────────┘            │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────┐
                    │   Monitoring & Logs     │
                    ├─────────────────────────┤
                    │   • CloudWatch Logs     │
                    │   • CloudWatch Metrics  │
                    │   • X-Ray Tracing       │
                    └─────────────────────────┘
```

> **📌 Note:** Add a detailed PNG architecture diagram to `/docs/architecture.png` for enhanced visualization.

### Architecture Flow

1. **Developer Push**: Code committed to GitHub repository (frontend or backend)
2. **Pipeline Trigger**: GitHub webhook activates CodePipeline via CodeStar Connection
3. **Source Stage**: Pipeline pulls latest code, SNS notification sent
4. **Build Stage**: CodeBuild executes buildspec.yml
   - Packages Lambda function code
   - Uploads Lambda package to S3 Lambda Deployment Bucket
   - Syncs frontend files (HTML/CSS/JS) to S3 Frontend Bucket
   - Creates CloudFront cache invalidation for frontend updates
   - Pulls dependencies from CodeArtifact if needed
5. **Deploy Stage**: 
   - CloudFormation updates infrastructure (Lambda, API Gateway, DynamoDB)
   - CodeDeploy performs canary deployment of Lambda function
6. **Runtime**: Users interact with CloudFront → S3 frontend → API Gateway → Lambda → DynamoDB
7. **Monitoring**: CloudWatch captures logs, metrics, and traces across all services

---

## ✨ Features

### Application Features
- ✅ **Full CRUD Operations** – Create, Read, Update, Delete products
- ✅ **RESTful API** – Standard HTTP methods (GET, POST, PUT, DELETE)
- ✅ **Serverless Backend** – Zero server management, auto-scaling
- ✅ **Responsive Frontend** – Modern static website with CloudFront CDN
- ✅ **NoSQL Database** – DynamoDB for high-performance data access
- ✅ **Real-time Data** – Instant product catalog updates
- ✅ **API Validation** – Request/response validation at API Gateway
- ✅ **Error Handling** – Comprehensive error messages and logging
- ✅ **Global CDN** – CloudFront for fast frontend delivery worldwide

### DevOps Features
- 🚀 **Automated CI/CD** – End-to-end pipeline from commit to deployment (frontend + backend)
- 📦 **Package Management** – CodeArtifact for dependency caching and version control
- 🏗️ **Infrastructure as Code** – CloudFormation templates for all resources
- 🔔 **Multi-Stage Notifications** – SNS alerts at every pipeline phase (Source, Build, Deploy, Success, Failure)
- 🎯 **Canary Deployments** – Gradual traffic shifting for Lambda updates (Canary10Percent5Minutes)
- 🔐 **Security Best Practices** – IAM least-privilege roles and policies
- 📊 **CloudWatch Integration** – Centralized logging and monitoring
- 🔄 **Automatic Rollback** – Failed deployments automatically revert
- 🧪 **Automated Testing** – Unit tests run before every deployment
- 📝 **Audit Trail** – Complete deployment history and change tracking
- ☁️ **Frontend CDN** – CloudFront distribution for global content delivery
- 🔥 **Cache Invalidation** – Automatic CloudFront cache clearing on frontend updates

### Enterprise-Ready Capabilities
- ⚡ **High Availability** – Multi-AZ deployment across AWS regions
- 📈 **Auto-Scaling** – Lambda and DynamoDB scale automatically
- 💰 **Cost-Optimized** – Pay-per-use pricing model
- 🔒 **Secure by Design** – Encryption at rest and in transit
- 🌍 **Global Deployment** – Can be deployed to any AWS region
- 📱 **Mobile-Ready** – API accessible from any client

---

## 🛠️ AWS Services Used

### CI/CD Services

| Service | Role in Architecture | Key Features Used |
|---------|---------------------|-------------------|
| **GitHub** | Source Code Repository | • Webhook integration for pipeline triggers<br>• Version control and branching<br>• Pull request workflows<br>• Code review capabilities |
| **CodePipeline** | CI/CD Orchestration | • Multi-stage pipeline automation<br>• Source/Build/Deploy stage management<br>• Manual approval gates (optional)<br>• Integration with SNS for notifications |
| **CodeBuild** | Build & Test Automation | • Docker-based build environments<br>• buildspec.yml execution<br>• Dependency installation from CodeArtifact<br>• Unit test execution<br>• Artifact packaging |
| **CodeDeploy** | Deployment Automation | • Lambda deployment with traffic shifting<br>• Canary and Linear deployment strategies<br>• Pre/Post deployment hooks<br>• Automatic rollback on failure |
| **CodeArtifact** | Package Repository | • npm/pip package caching<br>• Private package hosting<br>• Integration with public registries<br>• Version control and security scanning |

### Infrastructure Services

| Service | Role in Architecture | Key Features Used |
|---------|---------------------|-------------------|
| **CloudFormation** | Infrastructure as Code | • Template-based resource provisioning<br>• Stack management and updates<br>• Change sets for preview<br>• Automatic rollback on errors<br>• Cross-stack references |
| **Lambda** | Serverless Compute | • Function-as-a-Service execution<br>• Auto-scaling based on demand<br>• Version and alias management<br>• Environment variable configuration<br>• Layers for shared dependencies |
| **API Gateway** | API Management | • REST API endpoint creation<br>• Request/response transformation<br>• API key and usage plan management<br>• CORS configuration<br>• Integration with Lambda |
| **DynamoDB** | NoSQL Database | • Serverless, fully managed database<br>• On-demand or provisioned capacity<br>• Single-digit millisecond latency<br>• Automatic backup and restore<br>• Global tables for multi-region |
| **S3** | Object Storage & Static Hosting | • Static website hosting for frontend<br>• Artifact storage for CI/CD pipeline<br>• Lambda deployment package storage<br>• Versioning enabled for rollback<br>• Lifecycle policies for cost optimization<br>• CloudFront integration for CDN |
| **CloudFront** | Content Delivery Network | • Global edge locations for low latency<br>• HTTPS/SSL certificates<br>• Origin Access Identity for S3 security<br>• Cache invalidation on deployment<br>• Custom error pages (404/403) |

### Monitoring & Notification Services

| Service | Role in Architecture | Key Features Used |
|---------|---------------------|-------------------|
| **SNS** | Notification Service | • Topic-based pub/sub messaging<br>• Email, SMS, and HTTPS subscriptions<br>• Pipeline stage change notifications<br>• Build success/failure alerts<br>• Deployment status updates |
| **CloudWatch** | Monitoring & Logging | • Log aggregation from Lambda/API Gateway<br>• Custom metrics and dashboards<br>• Alarms for threshold monitoring<br>• Log Insights for querying<br>• X-Ray integration for tracing |
| **IAM** | Security & Access Control | • Service roles for Lambda, CodeBuild, CodePipeline<br>• Least-privilege policy enforcement<br>• Cross-service trust relationships<br>• Resource-based policies<br>• Role assumption for deployments |

### Service Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Service Dependencies                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  GitHub ──▶ CodePipeline ──▶ CodeBuild ──▶ CodeArtifact    │
│                    │              │                          │
│                    │              └──▶ S3 (Artifacts)        │
│                    │                                          │
│                    └──▶ CodeDeploy ──▶ Lambda ──▶ DynamoDB  │
│                           │                                   │
│                           └──▶ CloudFormation ──▶ All Resources│
│                                                               │
│  SNS ◀──── CloudWatch Events ◀──── All CI/CD Services       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
serverless-product-catalog/
│
├── README.md                           # This file - Complete project documentation
├── LICENSE                             # Project license (MIT)
├── .gitignore                          # Git ignore patterns
│
├── frontend/                           # S3-hosted static website
│   ├── index.html                      # Main landing page
│   ├── products.html                   # Product listing page
│   ├── product-detail.html             # Individual product view
│   ├── css/
│   │   ├── styles.css                  # Main stylesheet
│   │   ├── responsive.css              # Mobile-responsive styles
│   │   └── themes.css                  # Color themes
│   ├── js/
│   │   ├── app.js                      # Main application logic
│   │   ├── api.js                      # API client for backend calls
│   │   ├── utils.js                    # Helper functions
│   │   └── config.js                   # Frontend configuration
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png                # Company logo
│   │   │   └── placeholder.png         # Product image placeholder
│   │   └── fonts/                      # Custom fonts
│   └── tests/
│       └── e2e/                        # End-to-end frontend tests
│
├── backend/                            # Lambda functions
│   ├── src/
│   │   ├── create-product/
│   │   │   ├── index.js                # POST /products - Create new product
│   │   │   ├── package.json            # Function dependencies
│   │   │   └── validator.js            # Input validation logic
│   │   ├── get-product/
│   │   │   ├── index.js                # GET /products/{id} - Retrieve single product
│   │   │   └── package.json
│   │   ├── list-products/
│   │   │   ├── index.js                # GET /products - List all products
│   │   │   ├── package.json
│   │   │   └── pagination.js           # Pagination helper
│   │   ├── update-product/
│   │   │   ├── index.js                # PUT /products/{id} - Update product
│   │   │   ├── package.json
│   │   │   └── validator.js            # Update validation
│   │   ├── delete-product/
│   │   │   ├── index.js                # DELETE /products/{id} - Remove product
│   │   │   └── package.json
│   │   ├── shared/
│   │   │   ├── db-client.js            # DynamoDB client wrapper
│   │   │   ├── response-builder.js     # Standard API response formatter
│   │   │   ├── error-handler.js        # Centralized error handling
│   │   │   └── logger.js               # Structured logging utility
│   │   └── layers/
│   │       └── common/                 # Lambda layer for shared code
│   │           ├── nodejs/
│   │           │   └── node_modules/   # Shared dependencies
│   │           └── package.json
│   └── tests/
│       ├── unit/                       # Jest unit tests
│       │   ├── create-product.test.js
│       │   ├── get-product.test.js
│       │   ├── list-products.test.js
│       │   ├── update-product.test.js
│       │   └── delete-product.test.js
│       └── integration/                # Integration tests
│           └── api-integration.test.js
│
├── cloudformation/                     # Infrastructure as Code templates
│   ├── main.yaml                       # Master stack - orchestrates all nested stacks
│   ├── dynamodb.yaml                   # DynamoDB table definition
│   ├── lambda.yaml                     # Lambda functions and layers
│   ├── api-gateway.yaml                # API Gateway REST API configuration
│   ├── s3.yaml                         # S3 buckets for frontend and artifacts
│   ├── iam-roles.yaml                  # IAM roles and policies
│   ├── sns.yaml                        # SNS topics for notifications
│   ├── cloudwatch.yaml                 # CloudWatch alarms and dashboards
│   └── parameters/
│       ├── dev.json                    # Development environment parameters
│       ├── staging.json                # Staging environment parameters
│       └── prod.json                   # Production environment parameters
│
├── pipeline/                           # CI/CD configuration
│   ├── buildspec.yml                   # CodeBuild build instructions for Lambda & Frontend
│   ├── appspec.yml                     # CodeDeploy deployment configuration
│   ├── pipeline.yaml                   # CodePipeline CloudFormation template
│   ├── pre-traffic-hook.js             # Lambda hook before traffic shift
│   ├── post-traffic-hook.js            # Lambda hook after traffic shift
│   └── test-suite/
│       ├── smoke-tests.js              # Pre-deployment validation
│       └── integration-tests.js        # Post-deployment validation
│
├── scripts/                            # Automation and utility scripts
│   ├── deploy.sh                       # Main deployment script
│   ├── deploy-infrastructure.sh        # Deploy CloudFormation stacks
│   ├── deploy-pipeline.sh              # Create CI/CD pipeline
│   ├── cleanup.sh                      # Delete all AWS resources
│   ├── setup-codeartifact.sh           # Initialize CodeArtifact repository
│   ├── test-api.sh                     # API endpoint testing
│   ├── validate-templates.sh           # CloudFormation template validation
│   └── seed-data.sh                    # Populate DynamoDB with sample data
│
├── docs/                               # Documentation
│   ├── architecture.png                # Architecture diagram (PNG)
│   ├── architecture.drawio             # Editable architecture diagram
│   ├── API.md                          # Complete API documentation
│   ├── DEPLOYMENT.md                   # Detailed deployment guide
│   ├── TROUBLESHOOTING.md              # Common issues and solutions
│   ├── CONTRIBUTING.md                 # Contribution guidelines
│   ├── SECURITY.md                     # Security best practices
│   └── screenshots/                    # Application screenshots
│       ├── pipeline-execution.png
│       ├── frontend-ui.png
│       └── cloudwatch-dashboard.png
│
├── postman/                            # API testing collection
│   ├── Product-Catalog-API.postman_collection.json
│   ├── Environment-Dev.postman_environment.json
│   └── Environment-Prod.postman_environment.json
│
└── .github/                            # GitHub configuration
    └── workflows/
        └── validate.yml                # GitHub Actions for template validation
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `buildspec.yml` | Defines CodeBuild phases: packages Lambda, deploys frontend to S3, invalidates CloudFront |
| `appspec.yml` | Specifies CodeDeploy Lambda deployment config and traffic shifting |
| `main.yaml/json` | Master CloudFormation template that orchestrates all nested stacks |
| `pipeline.yaml/json` | Defines complete CI/CD pipeline as CloudFormation template |
| `deploy.sh` | One-command deployment script for the entire application |
| `cleanup.sh` | Safely removes all AWS resources to avoid charges |

---

## 👥 Credits

**Project Maintainer**: [Your Name / Organization]  
**Training Program**: AWS DevOps Professional Training  
**Course Module**: Module 15 - AWS Developer Tools

### Contributors

This project was developed as part of an AWS DevOps training curriculum to demonstrate real-world CI/CD practices using AWS native services.

### Acknowledgments

- AWS Documentation and Best Practices
- AWS Solutions Library
- Serverless Framework Community
- DevOps Community Contributors

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues, questions, or contributions:

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/your-repo/issues)
- **Documentation**: See `/docs` folder for detailed guides
- **Training Support**: Contact your course instructor

---

**Last Updated**: November 2025  
**Version**: 1.0.0

---

> **⭐ If you found this project helpful, please star the repository!**
