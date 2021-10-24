#!/bin/bash
### Renumber the order # in a Parser JSON file.

# echo text niceties
bold=$(tput bold)
normal=$(tput sgr0)

# prompt function
confirm() {
  while true; do
    read -r -n 1 -p "${1:-Continue?} [y/n]: " REPLY
    case $REPLY in
      [yY]) echo ; return 0 ;;
      [nN]) echo ; return 1 ;;
      *) printf " \033[31m %s \n\033[0m" "invalid input"
    esac
  done
}

confirm "Renumber the rules order in file: $1 ?" || exit 0

linenum=0
i=1

while IFS= read -r line; do
  ((linenum=linenum+1))

  if [[ "$line" =~ ^$ ]]
  then
    ((i=i+1))
  fi

  sed -r -i.bak "$linenum s/\"order\": \"[0-9]+\"/\"order\": \"$i\"/" $1
done < $1
