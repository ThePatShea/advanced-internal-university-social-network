#!/usr/bin/python

import datetime
import os
import subprocess


current_backup_path = '~/bubblebackup_data/'
mongodump_username = 'client'
mongodump_password = '569e356f-148a-f982-e429-ed09521ee2b3'
mongodump_host = 'production-db-a1.meteor.io:27017'
mongodump_port = '27017'
mongodump_database = 'bubble_meteor_com'

current_datetime = datetime.datetime.now()
current_backup_foldername = 'mongodump-' + current_datetime.strftime('%Y-%m-%d--%H_%M_%S')
current_backup_path = os.path.join(current_backup_path, current_backup_foldername)

print current_backup_path

#os.system(''mongodb://client:321524e6-680c-1fc3-5e99-27da50c1a3de@production-db-a1.meteor.io:27017/bubble_meteor_com')
#mongodump -u client -h production-db-a1.meteor.io:27017 -d bubble_meteor_com -p dc741741-bae1-0a4b-7c75-16d506469b5d

mongodump_exec_string = 'mongodump -u ' + mongodump_username + ' -h ' + mongodump_host +  ' -d ' + mongodump_database + ' -p ' + mongodump_password +   ' --out ' + current_backup_path
print mongodump_exec_string
os.system(mongodump_exec_string)
