## Advanced Internal University Social Network

#### Product Description
This web app is an internal social network for university organizations to collaborate on projects. Any club, dorm, fraternity/sorority, or sports team could create a group to discuss projects, post events, and upload/share files.

I built an extensive permissions system for this product. Students can make their groups public or private. Group members can be promoted to admins within a group, gaining the ability to add/remove members and delete unwanted discussions/events/files from the group. The web app contains 4 user levels depending on whether the user is a student, school administrator, student government leader, or Campus Bubble employee. Higher-level users get more permissions to view/moderate private content, and add/remove users from groups.

Additionally, it contains a section for school administrators to view statistics on how users/organizations are using the app. It also includes a purely public section for organizations to post events and discussions for the whole university to participate in.

Furthermore, the product integrates with universities’ official .edu sign-in systems, ensuring security and simplicity.

---

#### See the Web App
This web app is no longer online, but you can still view some images of it. These are mockups, but screenshots would look identical, because I'm awesome at front end.

**View the images:**
- The [Home](https://d2p9ez1wat05y7.cloudfront.net/portfolio_assets/63037/pictures/1435074608/original.jpg) page. Here, students would see the latest posts from their clubs, along with the hottest topics being discussed on campus.
- The [Announcements](https://d2p9ez1wat05y7.cloudfront.net/portfolio_assets/63039/pictures/1435074907/original.png) page. Here, students could post public announcements about any topic.
- The [Add Event](https://d2p9ez1wat05y7.cloudfront.net/portfolio_assets/63093/pictures/1435088936/original.jpg) submission form. A student would select the date/time, add an image, and attach relevant files to the event.
- The [View Event](https://d2p9ez1wat05y7.cloudfront.net/portfolio_assets/63097/pictures/1435089423/original.png) page. Here, students would view the date/time, location, and other relevant details about upcoming events and meetings for their clubs.
- The [Group Dashboard](https://d2p9ez1wat05y7.cloudfront.net/portfolio_assets/63107/pictures/1435090254/original.png) page. For each of their clubs, students would go to this page to get an overview of the latest discussions, events, and files posted by their group.
- The [Invite Members](https://d2p9ez1wat05y7.cloudfront.net/portfolio_assets/63118/pictures/1435091554/original.png) form. A group admin could search through all students at their school, then invite any of them to join their group.
- The [Search](https://d2p9ez1wat05y7.cloudfront.net/portfolio_assets/63114/pictures/1435090718/original.jpg) page. Students could search for any type of content from their school: groups, people, events, discussions, files, and more.
- The [Create Group](https://d2p9ez1wat05y7.cloudfront.net/portfolio_assets/63043/pictures/1435075387/original.png) page. Here, a student would add a new group to the web app. They could write the group's name/description, select a category, upload a profile picture, and add a cover photo.
- The [Edit Group](https://d2p9ez1wat05y7.cloudfront.net/portfolio_assets/63106/pictures/1435089854/original.png) form. A student would use this to edit the name, description, category, tags, profile photo, and cover photo of their group.

---

#### Disclaimer
I made most of my commits on this repo using another Github account called "campus-bubble". This was the account I used back when I was still working with my old company. If you'd like to verify this, please contact Campus Bubble's Chief of Product, Giovanni Hobbins: giovanni@campusbubble.com

---

#### Technologies Utilized
- Meteor stack including MongoDB/handlebars/stylus
- Several back-end node modules and meteor modules
- Several front-end Javascript libraries
- Integration with universities’ proprietary sign-in systems
- Fully responsive UI from desktop to mobile
- PhoneGap for iOS/Android apps

---

#### Resources/Timeline
I hired 4 full-time developers and led the team to build this product in 3 months.

---

#### Directory Navigation Instructions
I built this product using an MV* node.js framework called Meteor. If you are unfamiliar with Meteor's directory structure, every view gets its own folder with an HTML file and corresponding Javascript file that manages all the Javascript functions relating to that view.

[Click here to navigate directly to the "views" directory](https://github.com/ThePatShea/advanced-internal-university-social-network/tree/master/main/bubble_meteor/client/views)

---

#### Directory structure
```
-main/
  |__bubble_meteor/
      |__client/
        |__helpers/
        |__views/
      |__collections/
      |__server/
```
