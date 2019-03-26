#!/bin/sh
cd ../../log/
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
