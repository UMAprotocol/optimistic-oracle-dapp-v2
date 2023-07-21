#!/bin/bash

# Get the directory from the command line argument
dir="$1"

# Check if directory exists
if [ ! -d "$dir" ]; then
  echo "Directory $dir does not exist. Please specify a valid directory."
  exit 1
fi

find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "index.ts" | while read -r file; do
    # Check if the first line is "use client;", "use client" or 'use client' already
    first_line=$(head -n 1 "$file")
    if [[ "$first_line" != "\"use client\";" && "$first_line" != "\"use client\"" && "$first_line" != "'use client'" ]]; then
        # Add "use client"; at the beginning of the file if it's not already there
        echo "Processing $file"
        echo -e "\"use client\";\n$(cat "$file")" > temp_file && mv temp_file "$file"
    fi
done
