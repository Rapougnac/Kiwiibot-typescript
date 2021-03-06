#!/usr/bin/bash

CHAR__GREEN='\033[0;32m'
CHAR__RESET='\033[0m'
menuStr=""

function hideCursor(){
  printf "\033[?25l"
  # capture CTRL+C so cursor can be reset
  trap "showCursor && exit 0" 2
}
function showCursor(){
  printf "\033[?25h"
}
function clearLastMenu(){
  local msgLineCount=$(printf "$menuStr" | wc -l)
  # moves the curser up N lines so the output overwrites it
  echo -en "\033[${msgLineCount}A"
  # clear to end of screen to ensure there's no text left behind from previous input
  [ $1 ] && tput ed
}
function renderMenu(){
  local start=0
  local selector=""
  local instruction="$1"
  local selectedIndex=$2
  local listLength=$itemsLength
  local longest=0
  local spaces=""
  menuStr="\n $instruction\n"
  # Get the longest item from the list so that we know how many spaces to add
  # to ensure there's no overlap from longer items when a list is scrolling up or down.
  for (( i=0; i<$itemsLength; i++ )); do
    if (( ${#menuItems[i]} > longest )); then
      longest=${#menuItems[i]}
    fi
  done
  spaces=$(printf ' %.0s' $(eval "echo {1.."$(($longest))"}"))

  if [ $3 -ne 0 ]; then
    listLength=$3

    if [ $selectedIndex -ge $listLength ]; then
      start=$(($selectedIndex+1-$listLength))
      listLength=$(($selectedIndex+1))
    fi
  fi

  for (( i=$start; i<$listLength; i++ )); do
    local currItem="${menuItems[i]}"
    currItemLength=${#currItem}

    if [[ $i = $selectedIndex ]]; then
      selectedChoice="${currItem}"
      selector="${CHAR__GREEN}ᐅ${CHAR__RESET}"
      currItem="${CHAR__GREEN}${currItem}${CHAR__RESET}"
    else
      selector=" "
    fi

    currItem="${spaces:0:0}${currItem}${spaces:currItemLength}"

    menuStr="${menuStr}\n ${selector} ${currItem}"
  done

  menuStr="${menuStr}\n"
  # whether or not to overwrite the previous menu output
  [ $4 ] && clearLastMenu

  printf "${menuStr}"
}
function getChoice(){
  local KEY__ARROW_UP=$(echo -e "\033[A")
  local KEY__ARROW_DOWN=$(echo -e "\033[B")
  local KEY__ENTER=$(echo -e "\n")
  local captureInput=true
  local displayHelp=false
  local maxViewable=0
  local instruction="Select an item from the list:"
  local selectedIndex=0

  remainingArgs=()
  while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
      -h|--help)
        displayHelp=true
        shift
        ;;
      -i|--index)
        selectedIndex=$2
        shift 2
        ;;
      -m|--max)
        maxViewable=$2
        shift 2
        ;;
      -o|--options)
        menuItems=$2[@]
        menuItems=("${!menuItems}")
        shift 2
        ;;
      -q|--query)
        instruction="$2"
        shift 2
        ;;
      *)
        remainingArgs+=("$1")
        shift
        ;;
    esac
  done

  set -- "${remainingArgs[@]}"
  local itemsLength=${#menuItems[@]}

  # no menu items, at least 1 required
  if [[ $itemsLength -lt 1 ]]; then
    printf "\n [ERROR] No menu items provided\n"
    exit 1
  fi

  renderMenu "$instruction" $selectedIndex $maxViewable
  hideCursor

  while $captureInput; do
    read -rsn3 key # `3` captures the escape (\033'), bracket ([), & type (A) characters.

    case "$key" in
      "$KEY__ARROW_UP")
        selectedIndex=$((selectedIndex-1))
        (( $selectedIndex < 0 )) && selectedIndex=$((itemsLength-1))

        renderMenu "$instruction" $selectedIndex $maxViewable true
        ;;

      "$KEY__ARROW_DOWN")
        selectedIndex=$((selectedIndex+1))
        (( $selectedIndex == $itemsLength )) && selectedIndex=0

        renderMenu "$instruction" $selectedIndex $maxViewable true
        ;;

      "$KEY__ENTER")
        clearLastMenu true
        showCursor
        captureInput=false
        ;;
    esac
  done
}

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to run this script. Please install Node.js and try again."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  printf "\n [ERROR] npm is not installed\n"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  printf "pnpm was not found what do you want to do?"
  options=("Install pnpm" "Use npm" "Exit")
  getChoice -q "Choose your option" -o options -i $((${#options[@]}-1)) -m 4

  if [[ $selectedChoice = "Install pnpm" ]]; then
    npm install -g pnpm
    sleep 3
    echo "pnpm was installed successfully"
    pnpm i
    echo "All packages have been installed"
    sleep 2
    echo "Starting compilation of TypeScript"
    tsc
    echo "TypeScript compilation complete"
    sleep 1
    exit 0
  elif [[ $selectedChoice = "Use npm" ]]; then
    npm install
    sleep 3
    echo "All packages have been installed."
    sleep 2
    echo "Starting compilation of TypeScript"
    tsc
    echo "Compilation of TypeScript is complete"
    sleep 1
    exit 0
  else
    exit 0
  fi
else 
  pnpm i
  echo "All packages have been installed"
  sleep 2
  echo "Starting compilation of TypeScript"
  tsc
  echo "Compilation of TypeScript is complete"
  sleep 1
  exit 0
fi


