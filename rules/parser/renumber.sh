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

i=0
while IFS= read -r line; do
  ((i=i+1))
  sed -ir 's#"order": "[0-9]+"#"order": "$i"#g' $1
done < $1
