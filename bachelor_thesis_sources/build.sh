#!/bin/bash

rm -rf src/main/frontend/build
cd src/main/frontend
npm run build

cd ../../../
mvn clean package

scp -r target/fem.war student@fem.felk.cvut.cz:/home/student/download
