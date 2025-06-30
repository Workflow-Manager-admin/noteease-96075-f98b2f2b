#!/bin/bash
cd /home/kavia/workspace/code-generation/noteease-96075-f98b2f2b/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

