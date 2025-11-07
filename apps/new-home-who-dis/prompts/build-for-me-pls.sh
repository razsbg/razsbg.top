#!/bin/bash

# Detect script location and set up paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
APP_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Configuration
AUTONOMY_LEVEL="${DROID_AUTO_LEVEL:-medium}"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Logging function
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")

    echo "[${timestamp}] [${level}] ${message}" >> "${LOG_FILE}"

    case "${level}" in
        INFO)
            echo -e "${BLUE}[INFO]${NC} ${message}"
            ;;
        SUCCESS)
            echo -e "${GREEN}[✓]${NC} ${message}"
            ;;
        WARNING)
            echo -e "${YELLOW}[⚠]${NC} ${message}"
            ;;
        ERROR)
            echo -e "${RED}[✗]${NC} ${message}"
            ;;
        DEBUG)
            echo -e "${CYAN}[DEBUG]${NC} ${message}"
            ;;
        STEP)
            echo -e "${MAGENTA}[→]${NC} ${message}"
            ;;
    esac
}

# Usage function
usage() {
    echo ""
    echo "Usage: $0 <prompt-folder-name>"
    echo ""
    echo "Arguments:"
    echo "  prompt-folder-name    Name of the prompts folder (under apps/new-home-who-dis/prompts/)"
    echo ""
    echo "Environment Variables:"
    echo "  DROID_AUTO_LEVEL      Autonomy level: low|medium|high (default: medium)"
    echo ""
    echo "Examples:"
    echo "  $0 countdown-timer"
    echo "  DROID_AUTO_LEVEL=high $0 cloud-service-migration"
    echo ""
    exit 1
}

# Check arguments
if [[ $# -eq 0 ]]; then
    log ERROR "No prompt folder specified"
    usage
fi

PROMPT_FOLDER_NAME="$1"
PROMPT_DIR="${APP_ROOT}/prompts/${PROMPT_FOLDER_NAME}"
LOG_FILE="${APP_ROOT}/${PROMPT_FOLDER_NAME}-build.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Banner
echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║${NC}  ${GREEN}new-home-who-dis™️${NC} Build Orchestrator           ${MAGENTA}║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verify prompt directory exists
if [[ ! -d "${PROMPT_DIR}" ]]; then
    log ERROR "Prompt folder not found: ${PROMPT_DIR}"
    log INFO "Available folders in prompts/:"
    ls -1 "${APP_ROOT}/prompts/" 2>/dev/null || echo "  (none)"
    exit 1
fi

# Verify app root
if [[ ! -f "${APP_ROOT}/package.json" ]]; then
    log ERROR "Could not locate app package.json"
    log ERROR "Expected: ${APP_ROOT}/package.json"
    exit 1
fi

# Change to repo root for full context
cd "${REPO_ROOT}" || {
    log ERROR "Failed to change to repository root: ${REPO_ROOT}"
    exit 1
}

# Initialize log
echo "========================================" > "${LOG_FILE}"
log INFO "Build started at ${TIMESTAMP}"
log INFO "Prompt folder: ${PROMPT_FOLDER_NAME}"
log INFO "Autonomy level: ${AUTONOMY_LEVEL}"
log DEBUG "Repo root:    ${REPO_ROOT}"
log DEBUG "App root:     ${APP_ROOT}"
log DEBUG "Prompt dir:   ${PROMPT_DIR}"
log DEBUG "Working dir:  $(pwd)"
echo "" >> "${LOG_FILE}"

# Find context file (case-insensitive search for "context" in filename)
CONTEXT_FILE=$(find "${PROMPT_DIR}" -maxdepth 1 -type f -iname "*context*.md" | head -n 1)

if [[ -n "${CONTEXT_FILE}" ]]; then
    log INFO "Found context file: $(basename "${CONTEXT_FILE}")"
    CONTEXT_CONTENT=$(cat "${CONTEXT_FILE}")
else
    log WARNING "No context file found (searched for *context*.md)"
    CONTEXT_CONTENT=""
fi

# Counters
total_prompts=0
successful_prompts=0
failed_prompts=0
start_time=$SECONDS

# Find all prompt files (must start with a number, excluding context files)
prompt_files=($(find "${PROMPT_DIR}" -maxdepth 1 -type f -name "[0-9]*.md" ! -iname "*context*" | sort -V))

if [[ ${#prompt_files[@]} -eq 0 ]]; then
    echo ""
    log ERROR "No valid prompt files found in ${PROMPT_DIR}"
    echo ""
    echo -e "${YELLOW}Prompt File Requirements:${NC}"
    echo -e "  ${CYAN}•${NC} Files must start with a number (for sequential execution)"
    echo -e "  ${CYAN}•${NC} Numbering starts at ${GREEN}1${NC}, not 0"
    echo -e "  ${CYAN}•${NC} Format: ${GREEN}1-description.md${NC}, ${GREEN}2-description.md${NC}, etc."
    echo -e "  ${CYAN}•${NC} Context files (matching *context*.md) are automatically excluded"
    echo ""
    echo -e "${YELLOW}Example structure:${NC}"
    echo -e "  ${GREEN}✓${NC} 1-setup-component.md"
    echo -e "  ${GREEN}✓${NC} 2-add-styling.md"
    echo -e "  ${GREEN}✓${NC} 3-implement-logic.md"
    echo -e "  ${GREEN}✓${NC} project-context.md ${CYAN}(auto-detected, prepended to each prompt)${NC}"
    echo ""
    echo -e "${RED}✗${NC} 0-initial-setup.md ${CYAN}(should be 1-initial-setup.md)${NC}"
    echo -e "${RED}✗${NC} setup.md ${CYAN}(missing number prefix)${NC}"
    echo ""

    # List what we found
    all_md_files=($(find "${PROMPT_DIR}" -maxdepth 1 -type f -name "*.md" | sort))
    if [[ ${#all_md_files[@]} -gt 0 ]]; then
        log INFO "Found ${#all_md_files[@]} .md file(s) in the directory:"
        for file in "${all_md_files[@]}"; do
            filename=$(basename "$file")
            if [[ "$filename" =~ ^[0-9] ]]; then
                echo -e "  ${GREEN}✓${NC} $filename ${CYAN}(valid)${NC}"
            elif [[ "$filename" =~ [Cc][Oo][Nn][Tt][Ee][Xx][Tt] ]]; then
                echo -e "  ${BLUE}ℹ${NC} $filename ${CYAN}(context file - excluded from sequence)${NC}"
            else
                echo -e "  ${RED}✗${NC} $filename ${CYAN}(missing number prefix)${NC}"
            fi
        done
    fi
    echo ""
    exit 1
fi

# Validate that numbering starts at 1
first_file=$(basename "${prompt_files[0]}")
first_number=$(echo "$first_file" | grep -o '^[0-9]\+' | head -1)

if [[ "$first_number" != "1" ]]; then
    echo ""
    log ERROR "Invalid prompt numbering sequence"
    echo ""
    echo -e "${YELLOW}Issue:${NC} First prompt is ${RED}${first_number}-*.md${NC}, but should start at ${GREEN}1-*.md${NC}"
    echo ""
    echo -e "${YELLOW}Why?${NC} Prompts are executed sequentially in numbered order."
    echo -e "      Starting at 1 makes the sequence clear and intentional."
    echo ""
    echo -e "${YELLOW}Found prompts:${NC}"
    for pf in "${prompt_files[@]}"; do
        fname=$(basename "$pf")
        num=$(echo "$fname" | grep -o '^[0-9]\+' | head -1)
        if [[ "$num" == "1" ]]; then
            echo -e "  ${GREEN}✓${NC} $fname"
        else
            echo -e "  ${RED}✗${NC} $fname ${CYAN}(should be renumbered)${NC}"
        fi
    done
    echo ""
    echo -e "${YELLOW}Fix:${NC} Rename ${RED}${first_number}-*.md${NC} to ${GREEN}1-*.md${NC} (and adjust subsequent numbers)"
    echo ""
    exit 1
fi

total_prompts=${#prompt_files[@]}
log INFO "Found ${total_prompts} prompt(s) to process"
if [[ -n "${CONTEXT_FILE}" ]]; then
    log INFO "Context will be prepended to each prompt"
fi
echo ""

# Process each prompt
for i in "${!prompt_files[@]}"; do
    prompt_file="${prompt_files[$i]}"
    step_num=$((i + 1))
    filename=$(basename "${prompt_file}")

    log STEP "Step ${step_num}/${total_prompts}: ${filename}"
    echo -e "${CYAN}────────────────────────────────────────────────────────${NC}"

    # Create temporary combined prompt if context exists
    if [[ -n "${CONTEXT_CONTENT}" ]]; then
        TEMP_PROMPT=$(mktemp)
        trap "rm -f ${TEMP_PROMPT}" EXIT

        # Combine context and prompt
        {
            echo "# Context"
            echo ""
            echo "${CONTEXT_CONTENT}"
            echo ""
            echo "---"
            echo ""
            echo "# Task"
            echo ""
            cat "${prompt_file}"
        } > "${TEMP_PROMPT}"

        EXEC_FILE="${TEMP_PROMPT}"
        log DEBUG "Created temporary prompt with context"
    else
        EXEC_FILE="${prompt_file}"
    fi

    # Execute droid in headless mode with --auto flag
    log INFO "Executing: droid exec --auto ${AUTONOMY_LEVEL} --file ${filename}"

    # Capture output and exit code
    if droid exec --auto "${AUTONOMY_LEVEL}" --file "${EXEC_FILE}" 2>&1 | tee -a "${LOG_FILE}"; then
        exit_code=${PIPESTATUS[0]}

        if [[ ${exit_code} -eq 0 ]]; then
            successful_prompts=$((successful_prompts + 1))
            log SUCCESS "Step ${step_num} completed successfully"
        else
            failed_prompts=$((failed_prompts + 1))
            log ERROR "Step ${step_num} failed with exit code ${exit_code}"

            # Prompt to continue
            echo ""
            read -p "$(echo -e ${YELLOW}Continue with remaining prompts? [y/N]:${NC} )" -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log INFO "Build aborted by user at step ${step_num}"
                log INFO "To resume, fix the issue and re-run:"
                log INFO "  $0 ${PROMPT_FOLDER_NAME}"
                exit 1
            fi
        fi
    else
        failed_prompts=$((failed_prompts + 1))
        log ERROR "Step ${step_num} execution failed"

        echo ""
        read -p "$(echo -e ${YELLOW}Continue? [y/N]:${NC} )" -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log INFO "Build aborted at step ${step_num}"
            exit 1
        fi
    fi

    # Cleanup temp file if it exists
    [[ -n "${TEMP_PROMPT}" ]] && rm -f "${TEMP_PROMPT}"

    echo "" | tee -a "${LOG_FILE}"

    # Delay between prompts
    if [[ ${step_num} -lt ${total_prompts} ]]; then
        sleep 3
    fi
done

# Calculate build time
build_time=$((SECONDS - start_time))
minutes=$((build_time / 60))
seconds=$((build_time % 60))

# Summary
echo "" >> "${LOG_FILE}"
echo "========================================" >> "${LOG_FILE}"
echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║${NC}                    ${GREEN}Build Summary${NC}                     ${MAGENTA}║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

log INFO "Completed at: $(date +"%Y-%m-%d %H:%M:%S")"
log INFO "Total time:   ${minutes}m ${seconds}s"
echo ""
log INFO "Results:"
log INFO "  Total prompts:    ${total_prompts}"
log SUCCESS "  Successful:       ${successful_prompts}"
if [[ ${failed_prompts} -gt 0 ]]; then
    log ERROR "  Failed:           ${failed_prompts}"
else
    log INFO "  Failed:           ${failed_prompts}"
fi

if [[ ${total_prompts} -gt 0 ]]; then
    success_rate=$((successful_prompts * 100 / total_prompts))
    log INFO "  Success rate:     ${success_rate}%"
fi

echo ""
echo "========================================" >> "${LOG_FILE}"

# Exit with appropriate code
if [[ ${failed_prompts} -gt 0 ]]; then
    log WARNING "Build completed with ${failed_prompts} error(s)"
    log INFO "Full log: ${LOG_FILE}"
    exit 1
else
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}  🎉 ${GREEN}All prompts executed successfully!${NC}            ${GREEN}║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log INFO "Next steps:"
    log INFO "  1. Review changes in: apps/new-home-who-dis/src/"
    log INFO "  2. Test locally:      cd apps/new-home-who-dis && npm run dev"
    log INFO "  3. Commit changes:    git add . && git commit -m 'feat: ${PROMPT_FOLDER_NAME}'"
    echo ""
    exit 0
fi
