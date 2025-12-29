#!/bin/bash

# Navigate to your repository directory if needed
# cd /path/to/your/repo

# Stage all changes
git add .

# Prompt for a commit message
echo "Enter your commit message:"
read commit_message

# Commit changes
git commit -m "$commit_message"

# Push to main branch
git push origin main

# Optional: Print success message
echo "Changes have been committed and pushed successfully."