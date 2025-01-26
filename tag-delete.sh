#!/bin/bash

# Function to show usage instructions
show_usage() {
    echo "Usage: $0 [OPTIONS] <pattern>"
    echo "Delete git tags matching the specified pattern"
    echo
    echo "Options:"
    echo "  -d, --dry-run     Show what would be deleted without actually deleting"
    echo "  -r, --remote      Also delete tags from remote (default remote is 'origin')"
    echo "  -R, --remote-name Specify a different remote (default: origin)"
    echo "  -l, --list        List all tags matching pattern without deleting"
    echo "  -h, --help        Show this help message"
    echo
    echo "Examples:"
    echo "  $0 'v1.*'         # Delete all local tags starting with v1."
    echo "  $0 -r 'v1.*'      # Delete matching tags both locally and from remote"
    echo "  $0 -d 'v1.*'      # Show which tags would be deleted"
    echo "  $0 -R upstream '*' # Delete all tags from 'upstream' remote"
}

# Default values
DRY_RUN=false
DELETE_REMOTE=false
REMOTE_NAME="origin"
LIST_ONLY=false

# Parse command line options
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -r|--remote)
            DELETE_REMOTE=true
            shift
            ;;
        -R|--remote-name)
            REMOTE_NAME="$2"
            DELETE_REMOTE=true
            shift 2
            ;;
        -l|--list)
            LIST_ONLY=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            PATTERN="$1"
            shift
            ;;
    esac
done

# Check if pattern is provided
if [ -z "$PATTERN" ]; then
    echo "Error: No pattern specified"
    show_usage
    exit 1
fi

# Get matching tags
MATCHING_TAGS=$(git tag -l "$PATTERN")

if [ -z "$MATCHING_TAGS" ]; then
    echo "No tags found matching pattern: $PATTERN"
    exit 0
fi

# Just list tags if requested
if [ "$LIST_ONLY" = true ]; then
    echo "Tags matching pattern '$PATTERN':"
    echo "$MATCHING_TAGS"
    exit 0
fi

# Show what will be deleted
echo "The following tags match the pattern '$PATTERN':"
echo "$MATCHING_TAGS"
echo

# If dry run, exit here
if [ "$DRY_RUN" = true ]; then
    echo "Dry run - no tags were deleted"
    exit 0
fi

# Confirm deletion
read -p "Are you sure you want to delete these tags? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled"
    exit 1
fi

# Delete tags
echo "Deleting local tags..."
echo "$MATCHING_TAGS" | xargs git tag -d

# Delete remote tags if requested
if [ "$DELETE_REMOTE" = true ]; then
    echo "Deleting remote tags from $REMOTE_NAME..."
    echo "$MATCHING_TAGS" | xargs -I% git push "$REMOTE_NAME" :refs/tags/%
fi

echo "Operation completed successfully"