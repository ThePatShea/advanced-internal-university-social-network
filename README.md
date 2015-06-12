## Advanced Internal University Social Network

#### Product Description
This web app is an internal social network for university organizations to collaborate on projects. Any club, dorm, fraternity/sorority, or sports team could create a group to discuss projects, post events, and upload/share files.

I built an extensive permissions system for this product. Students can make their groups public or private. Group members can be promoted to admins within a group, gaining the ability to add/remove members and delete unwanted discussions/events/files from the group. The web app contains 4 user levels depending on whether the user is a student, school administrator, student government leader, or Campus Bubble employee. Higher-level users get more permissions to view/moderate private content, and add/remove users from groups.

Additionally, it contains a section for school administrators to view statistics on how users/organizations are using the app. It also includes a purely public section for organizations to post events and discussions for the whole university to participate in.

Furthermore, the product integrates with universities’ official .edu sign-in systems, ensuring security and simplicity. 

---

#### Disclaimer
I made most of my commits on this repo using another Github account called "campus-bubble". This was the account I used back when I was still working with my old company. If you'd like to verify this, please contact Campus Bubble's Chief of Product, Giovanni Hobbins: giovanni@campusbubble.com

---

#### Technologies Utilized
- Meteor stack including MongoDB/handlebars/stylus/nib
- Several back-end node modules and meteor modules
- Several front-end Javascript libraries
- Integration with universities’ proprietary sign-in systems
- Fully responsive UI from desktop to mobile
- PhoneGap for iOS/Android apps

---

#### Resources/Timeline
I hired 4 full-time developers and led the team to build this product in 3 months.

---

#### Instructions
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
