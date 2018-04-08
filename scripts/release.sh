#!/bin/bash
name="like"
echo ${name}
read -p "u name id like?(y/n)"
if $REPLY == "y"
echo 'y'