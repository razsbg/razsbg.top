#!/bin/bash

# Detect script location and set up paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
APP_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Configuration
PROMPT_DIR="${SCRIPT_DIR}"
LOG_FILE="${APP_ROOT}/countdown-timer-build.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Autonomy level for droid exec
# Options: low (file edits only) | medium (+ package installs) | high (+ git operations)
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

# Banner
echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║${NC}  ${GREEN}new-home-who-dis™️${NC} Countdown Timer Builder      ${MAGENTA}║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

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
log INFO "Autonomy level: ${AUTONOMY_LEVEL}"
log DEBUG "Repo root:    ${REPO_ROOT}"
log DEBUG "App root:     ${APP_ROOT}"
log DEBUG "Prompt dir:   ${PROMPT_DIR}"
log DEBUG "Working dir:  $(pwd)"
echo "" >> "${LOG_FILE}"

# Counters
total_prompts=0
successful_prompts=0
failed_prompts=0
start_time=$SECONDS

# Find all prompt files
prompt_files=($(ls ${PROMPT_DIR}/[0-9]-*.md 2>/dev/null | sort -V))

if [[ ${#prompt_files[@]} -eq 0 ]]; then
    log ERROR "No prompt files found in ${PROMPT_DIR}"
    log INFO "Expected format: 1-description.md, 2-description.md, etc."
    exit 1
fi

total_prompts=${#prompt_files[@]}
log INFO "Found ${total_prompts} prompt(s) to process"
echo ""

# Process each prompt
for i in "${!prompt_files[@]}"; do
    prompt_file="${prompt_files[$i]}"
    step_num=$((i + 1))
    filename=$(basename "${prompt_file}")

    log STEP "Step ${step_num}/${total_prompts}: ${filename}"
    echo -e "${CYAN}────────────────────────────────────────────────────────${NC}"

    # Execute droid in headless mode with --auto flag
    log INFO "Executing: droid exec --auto ${AUTONOMY_LEVEL} --file ${prompt_file}"

    # Capture output and exit code
    if droid exec --auto "${AUTONOMY_LEVEL}" --file "${prompt_file}" 2>&1 | tee -a "${LOG_FILE}"; then
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
                log INFO "Resume from this step:"
                log INFO "  droid exec --auto ${AUTONOMY_LEVEL} --file ${prompt_file}"
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
    log INFO "  3. Commit changes:    git add . && git commit -m 'feat: countdown timer'"
    echo ""
    exit 0
fi
