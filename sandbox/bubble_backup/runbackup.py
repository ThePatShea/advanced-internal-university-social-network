#!/usr/bin/python

import datetime
import os


current_backup_path = '~/bubblebackup_data/'
mongodump_username = 'client'
mongodump_password = '321524e6-680c-1fc3-5e99-27da50c1a3de'
mongodump_host = 'production-db-a1.meteor.io'
mongodump_port = '27017'
mongodump_collection = 'bubble_meteor_com'

current_datetime = datetime.datetime.now()
current_backup_foldername = 'mongodump-' + current_datetime.strftime('%Y-%m-%d--%H_%M_%S')
current_backup_path = os.path.join(current_backup_path, current_backup_foldername)

print current_backup_path

#os.system(''mongodb://client:321524e6-680c-1fc3-5e99-27da50c1a3de@production-db-a1.meteor.io:27017/bubble_meteor_com')
os.system('mongodump --username ' + mongodump_username + ' --password ' + mongodump_password + ' --host ' + mongodump_host + ' --port ' + mongodump_port + ' -d ' + mongodump_collection + ' --out ' + current_backup_path)


