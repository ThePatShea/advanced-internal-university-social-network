#!/usr/bin/python

import datetime
import os
import re



bubble_url = 'bubble.meteor.com'
current_backup_path = '~/bubblebackup_data/'

os.system('meteor mongo --url ' + bubble_url + ' > tmp')
tempfile = open('tmp', 'r')
tempfile.readline()
mongostring = tempfile.readline()
tempfile.close()
os.system('rm tmp')

match = re.search("(\w+)\:\/\/(\w+)\:([\w+\-]+)\@([\w\.\-]+)\:([0-9]+)\/(\w+)", mongostring)

mongodump_username = match.group(2)
mongodump_password = match.group(3)
mongodump_host = match.group(4)
mongodump_port = match.group(5)
mongodump_database = match.group(6)


current_datetime = datetime.datetime.now()
current_backup_foldername = 'mongodump-' + current_datetime.strftime('%Y-%m-%d--%H_%M_%S')
current_backup_path = os.path.join(current_backup_path, current_backup_foldername)

print current_backup_path


mongodump_exec_string = 'mongodump -u ' + mongodump_username + ' -h ' + mongodump_host +  ' -d ' + mongodump_database + ' -p ' + mongodump_password +   ' --out ' + current_backup_path
print mongodump_exec_string
os.system(mongodump_exec_string)
