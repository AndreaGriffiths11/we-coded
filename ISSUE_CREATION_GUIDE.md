# How to Create GitHub Issues from Templates

This repository contains 20 detailed improvement issue templates in the `.github/ISSUES/` directory. Here's how to create them as actual GitHub issues.

## Quick Start

### Prerequisites

1. **GitHub CLI** installed and authenticated
   ```bash
   # Check if installed
   gh --version
   
   # If not installed, visit: https://cli.github.com/
   
   # Authenticate
   gh auth login
   ```

2. Navigate to the issues directory:
   ```bash
   cd .github/ISSUES
   ```

## Method 1: Automated Script (Recommended)

Run the provided script to create all 20 issues automatically:

```bash
bash create-issues.sh
```

The script will:
- ✅ Verify GitHub CLI is installed and authenticated
- ✅ Extract title and labels from each file
- ✅ Create issues in the correct order
- ✅ Add a 1-second delay between issues to avoid rate limiting
- ✅ Show progress and success/failure status

**Example output:**
```
================================================
  WeCoded - Creating GitHub Issues
================================================

✓ GitHub CLI is installed and authenticated

Found 20 issue files to process

Do you want to create all 20 issues? (y/n) y

Creating issues...

Creating issue from: 01-unit-tests-useFetchStories.md
  Title: Add unit tests for useFetchStories hook
  Labels: testing, enhancement, good-first-issue
  ✓ Issue created successfully

...

================================================
✓ Successfully created: 20 issues
================================================
```

## Method 2: Manual Creation (One at a Time)

If you prefer to create issues individually or selectively:

```bash
# Format:
gh issue create --title "TITLE" --body-file FILENAME.md --label "LABELS"

# Example for first issue:
gh issue create \
  --title "Add unit tests for useFetchStories hook" \
  --body-file 01-unit-tests-useFetchStories.md \
  --label "testing,enhancement,good-first-issue"
```

### Create Specific Issues

To create only certain issues:

```bash
# Just testing issues (#1 and #2)
gh issue create --title "Add unit tests for useFetchStories hook" \
  --body-file 01-unit-tests-useFetchStories.md \
  --label "testing,enhancement,good-first-issue"

gh issue create --title "Add comprehensive E2E tests with Playwright" \
  --body-file 02-e2e-tests-playwright.md \
  --label "testing,enhancement,infrastructure"

# Just accessibility issues (#6, #7, #8)
gh issue create --title "Implement keyboard shortcuts for story navigation" \
  --body-file 06-keyboard-shortcuts-navigation.md \
  --label "enhancement,accessibility,a11y"

gh issue create --title "Add dark/light theme toggle" \
  --body-file 07-dark-light-theme-toggle.md \
  --label "enhancement,accessibility,ui/ux,a11y"

gh issue create --title "Implement comprehensive accessibility audit fixes" \
  --body-file 08-accessibility-audit.md \
  --label "accessibility,a11y,enhancement,bug"
```

## Method 3: Via GitHub Web Interface

If you can't use GitHub CLI:

1. Go to your repository on GitHub
2. Click the **Issues** tab
3. Click **New Issue**
4. Open one of the markdown files (e.g., `01-unit-tests-useFetchStories.md`)
5. Copy everything **after** the frontmatter (after the second `---`)
6. Paste into the issue body
7. Add the title from the frontmatter
8. Add labels from the frontmatter
9. Click **Submit new issue**

## Verification

After creating issues, verify they were created successfully:

```bash
# List all issues
gh issue list

# List issues with specific label
gh issue list --label "testing"
gh issue list --label "enhancement"
gh issue list --label "accessibility"

# View a specific issue
gh issue view 1
```

## Troubleshooting

### "gh: command not found"
Install GitHub CLI from https://cli.github.com/

### "Not authenticated"
Run `gh auth login` and follow the prompts

### "API rate limit exceeded"
Wait a few minutes, or create issues more slowly

### "Permission denied"
Ensure you have write access to the repository

### Script doesn't execute
Make it executable: `chmod +x create-issues.sh`

## Next Steps

After creating issues:

1. **Review and prioritize** - Some issues have dependencies
2. **Assign labels and milestones** - Organize by priority/sprint
3. **Add to project board** - Track progress visually
4. **Link related issues** - Use "Related to #X" or "Depends on #Y"
5. **Invite contributors** - Share issues labeled `good-first-issue`

## Issue Categories Summary

- 🧪 **Testing** (2 issues): #1, #2
- ⚡ **Performance** (3 issues): #3, #4, #5
- ♿ **Accessibility** (3 issues): #6, #7, #8
- ✨ **Features** (7 issues): #9, #10, #11, #14, #17, #18, #19
- 🎨 **UI/UX** (1 issue): #13
- 🏗️ **Architecture** (2 issues): #12, #15
- 📚 **Documentation** (2 issues): #16, #20

## Support

If you encounter any issues with the templates or script:
- Check the README.md in `.github/ISSUES/`
- Open a discussion on GitHub
- Contact the repository maintainers

---

**Happy issue creating! 🎉**
