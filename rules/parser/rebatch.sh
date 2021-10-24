#!/bin/bash
### Renumber the batchOrders in the JSON files within the CWD.

# echo text niceties
bold=$(tput bold)
normal=$(tput sgr0)

# Does target file exist? If not, leave.
target=$1
if [ -z $target ]
then
  echo $bold
  echo 'Please provide a filename to begin renumbering from.'
  echo 'Choices include:'
  echo $normal
  ls *.json
  echo ''
  exit 0
fi

# Find the batchOrder # from target files
targetMatch=$(grep -E -o -m 1 '"batchOrder": "[0-9]+"' $target)
targetNumber=$(echo $targetMatch| sed 's/[^0-9]//g')
echo "Target File is $target"
echo "Target batchOrder # is $targetNumber"
echo ''

# Get the remaining .json files and their batchOrder numbers if their number is => than the target file.
declare -a files
declare -a orderNumbers
shopt -s lastpipe
find . -type f -name '*.json' -print0 | while IFS= read -r -d '' file; do
  if [ "$file" != "./$target" ]
  then
    match=$(grep -E -o -m 1 '"batchOrder": "[0-9]+"' $file)
    number=$(echo $match| sed 's/[^0-9]//g')
    if [ $number -ge $targetNumber ]
    then
      fileinfo="$number:$file"
      files+=($fileinfo)
      orderNumbers+=($number)
    fi
  fi
done

# Check to see if the batchOrders need to be renumbered.
min=${orderNumbers[0]}
for value in "${orderNumbers[@]}"; do
  (( value < min )) && min=$value
done

if [ $min -ne $targetNumber ]
then
  echo $bold
  echo 'All batchOrder numbers are greater than Target file.'
  echo 'No need to renumber.'
  echo 'Exiting.'
  echo $normal
  echo "Target batchOrder# is $targetNumber"
  echo "Lowest batchOrder number in other files is $min"
  echo ''

  exit 0
fi

# Make sure remaining file batchOrder numbers are unique. Otherwise, this will not work.
IFS=$'\n' uniq=($(sort -n -u <<<"${orderNumbers[*]}"))
unset IFS

uniqCount=${#uniq[*]}
orderNumbersCount=${#orderNumbers[*]}

if [ $uniqCount -ne $orderNumbersCount ]
then
  echo $bold
  echo 'The batchOrder #s in the other files are not unique.'
  echo 'They need to be unique for this operation to proceed.'
  echo $normal

  exit 0
fi

# Sort the arrays
IFS=$'\n' sortedOrderedNumbers=($(sort -n <<<"${orderNumbers[*]}"))
unset IFS

declare -a sortedFiles
for ((i=0; i<${#sortedOrderedNumbers[*]}; i++));
do
  for ((j=0; j<${#files[*]}; j++));
  do
    sortedOrderedNumbersContains=${sortedOrderedNumbers[$i]}
    fileContains=$(echo ${files[j]} | sed 's/[^0-9]*//g')

    if [ $sortedOrderedNumbersContains -eq $fileContains ]
    then
      targetfile=${files[$j]}
      remove="${sortedOrderedNumbers[$i]}:"
      filename=${targetfile#${remove}}
      sortedFiles[$i]=$filename
    fi

  done
done

# Now update the batchOrder #'s
last=$min
for ((i=0; i<${#sortedFiles[*]}; i++));
do
  editfile=${sortedFiles[$i]}
  old=${sortedOrderedNumbers[$i]}
  if [ $last -eq $old ]
  then
    ((new=$old+1))
    sed -r -i "s/\"batchOrder\": \"[0-9]+\"/\"batchOrder\": \"$new\"/g" $editfile
  fi
((last++))
done
