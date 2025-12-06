# Deploy Frontend to S3 and Invalidate CloudFront Cache
# Usage: .\deploy-frontend.ps1

param(
    [string]$Environment = "dev",
    [string]$StackName = "product-catalog-base"
)

Write-Host "`n=== Frontend Deployment Script ===" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Stack Name: $StackName`n" -ForegroundColor Yellow

# Get S3 bucket name from CloudFormation stack
Write-Host "Fetching S3 bucket name from CloudFormation..." -ForegroundColor Cyan
$bucketName = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --query "Stacks[0].Outputs[?OutputKey=='FrontendS3BucketName'].OutputValue" `
    --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to get S3 bucket name from stack: $StackName" -ForegroundColor Red
    exit 1
}

Write-Host "✓ S3 Bucket: $bucketName" -ForegroundColor Green

# Get CloudFront Distribution ID
Write-Host "`nFetching CloudFront Distribution ID..." -ForegroundColor Cyan
$distributionId = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" `
    --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to get CloudFront Distribution ID" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Distribution ID: $distributionId" -ForegroundColor Green

# Sync frontend files to S3
Write-Host "`nUploading frontend files to S3..." -ForegroundColor Cyan
aws s3 sync "../frontend" "s3://$bucketName" `
    --delete `
    --cache-control "public, max-age=31536000" `
    --exclude "*.md" `
    --exclude ".git/*"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to upload files to S3" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Files uploaded successfully" -ForegroundColor Green

# Set cache-control for HTML files (shorter cache)
Write-Host "`nUpdating cache settings for HTML files..." -ForegroundColor Cyan
aws s3 cp "s3://$bucketName/index.html" "s3://$bucketName/index.html" `
    --cache-control "no-cache, no-store, must-revalidate" `
    --metadata-directive REPLACE `
    --content-type "text/html"

Write-Host "✓ Cache settings updated" -ForegroundColor Green

# Create CloudFront invalidation
Write-Host "`nCreating CloudFront invalidation..." -ForegroundColor Cyan
$invalidationId = aws cloudfront create-invalidation `
    --distribution-id $distributionId `
    --paths "/*" `
    --query "Invalidation.Id" `
    --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to create CloudFront invalidation" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Invalidation created: $invalidationId" -ForegroundColor Green

# Get CloudFront URL
$cloudFrontUrl = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" `
    --output text

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green
Write-Host "Website URL: $cloudFrontUrl" -ForegroundColor Cyan
Write-Host "`nNote: CloudFront invalidation may take 3-5 minutes to complete." -ForegroundColor Yellow
Write-Host "Check status: aws cloudfront get-invalidation --distribution-id $distributionId --id $invalidationId`n" -ForegroundColor Gray
