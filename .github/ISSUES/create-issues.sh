#!/bin/bash

# Script to create GitHub issues from markdown files
# Requires: gh CLI (GitHub CLI) to be installed and authenticated

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  WeCoded - Creating GitHub Issues${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub CLI.${NC}"
    echo "Please run: gh auth login"
    exit 1
fi

echo -e "${GREEN}✓ GitHub CLI is installed and authenticated${NC}"
echo ""

# Function to extract title from frontmatter
get_title() {
    local file=$1
    grep "^title:" "$file" | sed 's/title: //' | tr -d "'"
}

# Function to extract labels from frontmatter
get_labels() {
    local file=$1
    grep "^labels:" "$file" | sed 's/labels: //'
}

# Function to create issue from file
create_issue() {
    local file=$1
    local number=$(basename "$file" | cut -d'-' -f1)
    
    echo -e "${BLUE}Creating issue from: $file${NC}"
    
    # Extract metadata
    local title=$(get_title "$file")
    local labels=$(get_labels "$file")
    
    # Remove frontmatter for body (everything between --- markers)
    local body=$(sed '1,/^---$/d' "$file" | sed '1,/^---$/d')
    
    if [ -z "$title" ]; then
        echo -e "${RED}  ✗ Could not extract title from $file${NC}"
        return 1
    fi
    
    echo "  Title: $title"
    echo "  Labels: $labels"
    
    # Create issue
    if echo "$body" | gh issue create --title "$title" --body-file - --label "$labels" > /dev/null; then
        echo -e "${GREEN}  ✓ Issue created successfully${NC}"
    else
        echo -e "${RED}  ✗ Failed to create issue${NC}"
        return 1
    fi
    
    echo ""
}

# Get all issue files sorted by number
issue_files=$(ls -1 [0-9][0-9]-*.md 2>/dev/null | sort)

if [ -z "$issue_files" ]; then
    echo -e "${RED}No issue files found in current directory.${NC}"
    echo "Please run this script from the .github/ISSUES directory."
    exit 1
fi

# Count total issues
total=$(echo "$issue_files" | wc -l)
echo -e "Found ${GREEN}$total${NC} issue files to process"
echo ""

# Ask for confirmation
read -p "Do you want to create all $total issues? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}Creating issues...${NC}"
echo ""

# Counter for created issues
created=0
failed=0

# Create each issue
for file in $issue_files; do
    if create_issue "$file"; then
        ((created++))
    else
        ((failed++))
    fi
    
    # Add a small delay to avoid rate limiting
    sleep 1
done

echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}✓ Successfully created: $created issues${NC}"
if [ $failed -gt 0 ]; then
    echo -e "${RED}✗ Failed to create: $failed issues${NC}"
fi
echo -e "${BLUE}================================================${NC}"
echo ""
echo "View all issues at:"
echo "$(gh repo view --json url -q .url)/issues"
