# Quick Deployment Instructions

## Deployment Steps

### 1. Update CloudFormation Stack (if not already deployed with CloudFront)
```powershell
cd "d:\My Training\AWS Training\Module-15 AWS Developer Tools\project"

# Update base infrastructure stack with CloudFront
aws cloudformation update-stack `
  --stack-name product-catalog-base `
  --template-body file://aws/templates/base_infra.json `
  --parameters ParameterKey=ProjectName,ParameterValue=product-catalog ParameterKey=Environment,ParameterValue=dev `
  --capabilities CAPABILITY_IAM

# Wait for stack update to complete (takes 5-10 minutes for CloudFront)
aws cloudformation wait stack-update-complete --stack-name product-catalog-base
```

### 2. Deploy Frontend Files
```powershell
cd scripts
.\deploy-frontend.ps1 -Environment dev -StackName product-catalog-base
```

### 3. Get Website URL
```powershell
aws cloudformation describe-stacks `
  --stack-name product-catalog-base `
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" `
  --output text
```

## Manual Upload (Alternative)

### Get S3 Bucket Name
```powershell
aws cloudformation describe-stacks `
  --stack-name product-catalog-base `
  --query "Stacks[0].Outputs[?OutputKey=='FrontendS3BucketName'].OutputValue" `
  --output text
```

### Upload Files
```powershell
cd "d:\My Training\AWS Training\Module-15 AWS Developer Tools\project"

aws s3 sync frontend s3://YOUR-BUCKET-NAME --delete
```

### Invalidate CloudFront Cache
```powershell
# Get Distribution ID
$distId = aws cloudformation describe-stacks `
  --stack-name product-catalog-base `
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" `
  --output text

# Create invalidation
aws cloudfront create-invalidation --distribution-id $distId --paths "/*"
```

## Architecture Changes

### Before (Direct S3 Website)
- S3 bucket with public access
- HTTP only (no SSL)
- S3 website endpoint
- Direct S3 access

### After (CloudFront + S3)
- S3 bucket with private access
- HTTPS (SSL) by default
- CloudFront CDN distribution
- Origin Access Identity (OAI) for security
- Global edge locations for faster delivery
- Cache control and compression

## Benefits

✅ **HTTPS/SSL** - Secure connection by default
✅ **Global CDN** - Faster load times worldwide
✅ **Security** - Private S3 bucket, no public access
✅ **Performance** - Edge caching and compression
✅ **Cost Effective** - Reduced S3 data transfer costs
✅ **DDoS Protection** - AWS Shield Standard included

## CloudFront Features Configured

- **Default Root Object**: index.html
- **HTTP Version**: HTTP/2
- **Viewer Protocol**: Redirect HTTP to HTTPS
- **Compression**: Enabled (gzip)
- **Cache TTL**: 24 hours default
- **Custom Error Pages**: 404/403 redirect to index.html (SPA support)
- **Price Class**: 100 (North America & Europe)

## Deployment Time

- Initial CloudFormation stack update: ~10-15 minutes (CloudFront creation)
- File upload to S3: ~10-30 seconds
- CloudFront invalidation: ~3-5 minutes

## Testing

After deployment, test your website:

1. **Get URL**:
   ```powershell
   aws cloudformation describe-stacks --stack-name product-catalog-base --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text
   ```

2. **Open in browser**: URL will be like `https://d1234567890abc.cloudfront.net`

3. **Test CRUD operations** through the frontend UI

## Troubleshooting

### Stack update fails
- Check if stack already has CloudFront (may need to delete and recreate)
- Verify AWS credentials and permissions

### Files not updating
- Run CloudFront invalidation after upload
- Wait 3-5 minutes for cache to clear
- Check browser cache (Ctrl+Shift+R for hard refresh)

### CORS errors
- API Gateway has CORS headers configured in Lambda
- CloudFront allows GET, HEAD, OPTIONS methods
- Verify API endpoint in `frontend/js/config.js`

### 404 errors
- CloudFront custom error responses redirect to index.html
- Verify index.html exists in S3 bucket root
- Check CloudFront distribution status (must be "Deployed")
