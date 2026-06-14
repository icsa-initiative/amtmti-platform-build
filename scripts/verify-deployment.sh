#!/bin/bash

# AMTMTI Platform - Deployment Verification Script
# Run this after deployment to verify all systems are working

set -e

echo "🔍 AMTMTI Platform Deployment Verification"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check environment variables
echo "📋 Checking Environment Variables..."
required_vars=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "EMAIL_PROVIDER"
  "EMAIL_FROM"
  "COMPANY_EMAIL"
)

missing_vars=()
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
  echo -e "${GREEN}✓ All required environment variables set${NC}"
else
  echo -e "${RED}✗ Missing environment variables:${NC}"
  for var in "${missing_vars[@]}"; do
    echo "  - $var"
  done
  exit 1
fi

# Check email provider config
echo ""
echo "📧 Checking Email Service Configuration..."
if [ "$EMAIL_PROVIDER" = "resend" ]; then
  if [ -z "$RESEND_API_KEY" ]; then
    echo -e "${RED}✗ Resend selected but RESEND_API_KEY not configured${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ Resend configured${NC}"
elif [ "$EMAIL_PROVIDER" = "sendgrid" ]; then
  if [ -z "$SENDGRID_API_KEY" ]; then
    echo -e "${RED}✗ SendGrid selected but SENDGRID_API_KEY not configured${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ SendGrid configured${NC}"
else
  echo -e "${YELLOW}⚠ Unknown EMAIL_PROVIDER: $EMAIL_PROVIDER${NC}"
fi

# Check Node version
echo ""
echo "🔧 Checking Node.js Version..."
node_version=$(node -v)
echo "Node version: $node_version"

# Check npm packages
echo ""
echo "📦 Checking npm Packages..."
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠ node_modules not found. Run 'npm ci' first${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Check build
echo ""
echo "🏗️  Checking Build..."
if npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Build successful${NC}"
else
  echo -e "${RED}✗ Build failed. Run 'npm run build' for details${NC}"
  exit 1
fi

# Test API endpoints
echo ""
echo "🌐 Testing API Endpoints..."

base_url="http://localhost:3000"
endpoints=(
  "/api/enrollment/submit"
  "/api/contact/submit"
  "/api/newsletter/subscribe"
  "/api/membership/submit"
)

# Note: Full testing requires running dev server
echo "Start server with 'npm run dev' to fully test endpoints"

echo ""
echo "✅ Pre-Deployment Verification Complete!"
echo ""
echo "Next steps:"
echo "1. Review environment variables"
echo "2. Test email delivery (send test enrollment)"
echo "3. Verify database (check Supabase)"
echo "4. Test in staging environment"
echo "5. Deploy to production"
