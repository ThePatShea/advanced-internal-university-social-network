from fabric.api import *
from fabric.api import run, put
from fabric.colors import green as _green
from fabric.colors import yellow as _yellow

import boto
import boto.ec2

from config import *

import time


REPO_URL = 'github.com/campus-bubble/bubble-3.git'

BASE_REPO_PATH = '/home/ubuntu/emory_bubble'
BASE_BUNDLE_PATH = BASE_REPO_PATH + '/bubble-3/sandbox/bubble_bundle'
FIBERS_INSTALL_PATH = BASE_BUNDLE_PATH + '/bundle/server'



def create_bundle_image(blank_ami_id, path_to_bundle, new_ami_name, secure_flag, git_login, git_password):
	"""
	Creates an EC2 instance, installs the Emory Bubble Bundle on it. And takes a snapshot to create an AMI
	"""

	print (_green("Started..."))

	ec2 = boto.connect_ec2()
	reservation = ec2.run_instances(image_id=blank_ami_id, key_name='xavier-macbook-campusbubble', security_groups=['WEB'], instance_type='m1.large', placement='us-east-1b')
	print reservation
	time.sleep(10)
	instance = reservation.instances[0]
	instance.update()
	while instance.state == u'pending':
		print (_yellow("Instance state: %s" % instance.state))
		time.sleep(10)
		instance.update()

	print (_green("Instance state: %s" % instance.state))
	print (_green("Instance public DNS name: %s" % instance.public_dns_name))

	time.sleep(30)

	if(secure_flag == 'secure'):
		execute(deploy_bundle_secure, path_to_bundle, git_login, git_password, hosts=['ubuntu@'+instance.public_dns_name])
	elif(secure_flag == 'insecure'):
		execute(deploy_bundle_insecure, path_to_bundle, git_login, git_password, hosts=['ubuntu@'+instance.public_dns_name])
	else:
		print(_yellow("Error, secure_flag not recognized ..."))
		return

	print(_green("Deployed bundle..."))

	
	new_ami_id = ec2.create_image(instance.id, new_ami_name)
	print (_yellow("New AMI created: %s" % new_ami_id))
	time.sleep(20)

	images = ec2.get_all_images(image_ids=[new_ami_id])
	new_image = images[0]
	while new_image.state != u'available':
		print (_yellow("New AMI is %s" % new_image.state))
		time.sleep(10)
		images = ec2.get_all_images(image_ids=[new_ami_id])
		new_image = images[0]

	print (_green("New AMI %s is available" % new_ami_id))

	ec2.terminate_instances(instance_ids=[instance.id])




def create_bundle_test_image(blank_ami_id, path_to_bundle, new_ami_name, secure_flag, git_login, git_password):
	"""
	Creates an EC2 instance, installs the Emory Bubble Test Bundle on it. And takes a snapshot to create an AMI
	"""

	print (_green("Started..."))

	ec2 = boto.connect_ec2()
	reservation = ec2.run_instances(image_id=blank_ami_id, key_name='xavier-macbook-campusbubble', security_groups=['WEB'], instance_type='m1.large', placement='us-east-1b')
	print reservation
	time.sleep(10)
	instance = reservation.instances[0]
	instance.update()
	while instance.state == u'pending':
		print (_yellow("Instance state: %s" % instance.state))
		time.sleep(10)
		instance.update()

	print (_green("Instance state: %s" % instance.state))
	print (_green("Instance public DNS name: %s" % instance.public_dns_name))

	time.sleep(30)

	execute(deploy_bundle_test, path_to_bundle, git_login, git_password, hosts=['ubuntu@'+instance.public_dns_name])

	print(_green("Deployed bundle..."))

	
	new_ami_id = ec2.create_image(instance.id, new_ami_name)
	print (_yellow("New AMI created: %s" % new_ami_id))
	time.sleep(20)

	images = ec2.get_all_images(image_ids=[new_ami_id])
	new_image = images[0]
	while new_image.state != u'available':
		print (_yellow("New AMI is %s" % new_image.state))
		time.sleep(10)
		images = ec2.get_all_images(image_ids=[new_ami_id])
		new_image = images[0]

	print (_green("New AMI %s is available" % new_ami_id))

	ec2.terminate_instances(instance_ids=[instance.id])




def start_bundle_instance(blank_ami_id, new_instance_name, path_to_bundle, secure_flag, git_login, git_password):
	"""
	Starts up a new mi.large instance with the bundle deployed to it and running
	"""

	print(_green("Started..."))
	ec2 = boto.connect_ec2()
	reservation = ec2.run_instances(image_id=blank_ami_id, key_name='xavier-macbook-campusbubble', security_groups=['WEB'], instance_type='m1.large', placement='us-east-1b')
	instance = reservation.instances[0]
	instance.add_tag('Name', new_instance_name)
	instance.update()
	while instance.state == u'pending':
		print (_yellow("Instance state: %s" % instance.state))
		time.sleep(10)
		instance.update()

	print (_green("Instance state: %s" % instance.state))
	print (_green("Instance public DNS name: %s" % instance.public_dns_name))

	time.sleep(30)

	if(secure_flag == 'secure'):
		execute(deploy_bundle_secure, path_to_bundle, git_login, git_password, hosts=['ubuntu@'+instance.public_dns_name])
	elif(secure_flag == 'insecure'):
		execute(deploy_bundle_insecure, path_to_bundle, git_login, git_password, hosts=['ubuntu@'+instance.public_dns_name])
	else:
		print(_yellow("Error, secure_flag not recognized ..."))
		return
	
	print(_green("Deployed bundle to %s" % instance.public_dns_name))



def update_bundle_instance(instance_ip, path_to_bundle, secure_flag, git_login, git_password):
	"""
	Copies the bundle to the running instance and updates it.
	"""
	if(secure_flag == 'secure'):
		execute(deploy_bundle_secure, path_to_bundle, git_login, git_password, hosts=['ubuntu@'+instance_ip])
	elif(secure_flag == 'insecure'):
		execute(deploy_bundle_insecure, path_to_bundle, git_login, git_password, hosts=['ubuntu@'+instance_ip])
	else:
		print(_yellow("Error, secure_flag not recognized ..."))
		return
		
	print(_green("Deployed bundle to %s" % instance_ip))



def update_test_bundle_instance(instance_ip, path_to_bundle, secure_flag, git_login, git_password):
	"""
	Copies the bundle to the running instance and updates it.
	"""

	execute(deploy_bundle_test, path_to_bundle, git_login, git_password, hosts=['ubuntu@'+instance_ip])
		
	print(_green("Deployed bundle to %s" % instance_ip))





def deploy_bundle_secure(path_to_bundle, git_login, git_password):
	run('rm -rf /home/ubuntu/emory_bubble')
	run('mkdir /home/ubuntu/emory_bubble')
	with cd('/home/ubuntu/emory_bubble'):
		run('git clone https://' + git_login +':' + git_password +'@github.com/campus-bubble/bubble-3.git')
	with cd('/home/ubuntu/emory_bubble/bubble-3'):
		run('git checkout submaster')
	put(path_to_bundle, '/home/ubuntu/emory_bubble/bubble-3/sandbox/bubble_bundle')
	run('sudo apt-get update -y')
	run('sudo apt-get install -y build-essential')
	run('sudo npm install -g node-gyp')
	run('sudo npm install -g fibers@1.0.0')
	with cd('/home/ubuntu/emory_bubble/bubble-3/sandbox/bubble_bundle'):
		#run('git pull')
		run('sudo stop bubble')
		run('./configure_secure.sh')
		run('sudo ./setup_bubble_secure.sh')
		run('sudo ./start_bubble_secure.sh')



def deploy_bundle_insecure(path_to_bundle, git_login, git_password):
	run('rm -rf /home/ubuntu/emory_bubble')
	run('mkdir /home/ubuntu/emory_bubble')
	with cd('/home/ubuntu/emory_bubble'):
		run('git clone https://' + git_login +':' + git_password +'@github.com/campus-bubble/bubble-3.git')
	with cd('/home/ubuntu/emory_bubble/bubble-3'):
		run('git checkout submaster')
	put(path_to_bundle, '/home/ubuntu/emory_bubble/bubble-3/sandbox/bubble_bundle')
	run('sudo apt-get update -y')
	run('sudo apt-get install -y build-essential')
	run('sudo npm install -g node-gyp')
	run('sudo npm install -g fibers@1.0.0')
	with cd('/home/ubuntu/emory_bubble/bubble-3/sandbox/bubble_bundle'):
		#run('git pull')
		run('sudo stop bubble')
		run('./configure.sh')
		run('sudo ./setup_bubble.sh')
		run('sudo ./start_bubble.sh')


def deploy_bundle_test(path_to_bundle, git_login, git_password):
	with settings(warn_only=True):
		run('rm -rf ' + BASE_REPO_PATH)
	run('mkdir ' + BASE_REPO_PATH)
	with cd(BASE_REPO_PATH):
		run('git clone https://' + git_login +':' + git_password + '@' + REPO_URL)
	with cd(BASE_BUNDLE_PATH):
		run('git checkout submaster')
	put(path_to_bundle, BASE_BUNDLE_PATH)
	run('sudo apt-get update -y')
	run('sudo apt-get install -y build-essential')
	run('sudo npm install -g node-gyp')
	run('sudo npm install -g fibers@1.0.0')
	with cd(BASE_BUNDLE_PATH):
		with settings(warn_only=True):
			run('sudo stop bubble')
		run('./configure_test.sh')
		run('sudo ./setup_bubble_test.sh')
		run('sudo ./start_bubble_test.sh')

