from fabric.api import *
from fabric.api import run, put
from fabric.colors import green as _green
from fabric.colors import yellow as _yellow

import boto
import boto.ec2

from config import *

import time



def connect_to_server(hostname):
	execute(getlist, hosts=[hostname])
	execute(move_file, hosts=[hostname])
	execute(getlist, hosts=[hostname])

def getlist():
	run('ls -l')

def move_file():
	put('/Users/pxferna/amazon/bubble_bundle.tgz', '/home/ubuntu/emory_bubble/bubble-3/sandbox/bubble_bundle')


def create_bundle_image(blank_ami_id, new_ami_name):
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

	execute(move_file, hosts=['ubuntu@'+instance.public_dns_name])
	execute(deploy_bundle, hosts=['ubuntu@'+instance.public_dns_name])
	print(_green("Deployed bundle..."))

	
	new_ami_id = ec2.create_image(instance.id, new_ami_name)
	print (_yellow("New AMI created: %s" % new_ami_id))

	images = ec2.get_all_images(image_ids=[new_ami_id])
	new_image = images[0]
	while new_image.state != u'available':
		print (_yellow("New AMI is %s" % new_image.state))
		time.sleep(10)
		images = ec2.get_all_images(image_ids=[new_ami_id])
		new_image = images[0]

	print (_green("New AMI %s is available" % new_ami_id))

	ec2.terminate_instances(instance_ids=[instance.id])




def deploy_bundle():
	run('sudo apt-get update -y')
	run('sudo apt-get install -y build-essential')
	run('sudo npm install -g node-gyp')
	run('sudo npm install -g fibers@1.0.0')
	run('cd /home/ubuntu/emory_bubble/bubble-3/sandbox/bubble_bundle')
	run('git pull')
	run('./configure_secure.sh')
	run('sudo ./setup_bubble_secure.sh')
	run('sudo ./start_bubble_secure.sh')
