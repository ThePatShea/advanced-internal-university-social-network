# Advanced Internal University Social Network

#### Product Description
This web app is an internal social network for university organizations to collaborate on projects. Any club, dorm, fraternity/sorority, or sports team could create a group to discuss projects, post events, and upload/share files.

I built an extensive permissions system for this product. Students can make their groups public or private. Group members can be promoted to admins within a group, gaining the ability to add/remove members and delete unwanted discussions/events/files from the group. The web app contains 4 user levels depending on whether the user is a student, school administrator, student government leader, or Campus Bubble employee. Higher-level users get more permissions to view/moderate private content, and add/remove users from groups.

Additionally, it contains a section for school administrators to view statistics on how users/organizations are using the app. It also includes a purely public section for organizations to post events and discussions for the whole university to participate in.

Furthermore, the product integrates with universities’ official .edu sign-in systems, ensuring security and simplicity. 




- Technologies utilized: 
---- Meteor stack including MongoDB/handlebars/stylus/nib
---- Several back-end node modules and meteor modules
---- Several front-end Javascript libraries
---- Integration with universities’ proprietary sign-in systems
---- Fully responsive UI from desktop to mobile
---- PhoneGap for iOS/Android apps
- Resources/timeline: I hired 4 full-time developers and led the team to build this product in 3 months.
- Link to GitHub repo: https://github.com/ThePatShea/advanced-internal-university-social-network 
- Other notes: I’m not sure how familiar you are with the directory structure of Meteor’s MV* framework, but basically every view gets its own folder with an HTML file and corresponding Javascript file that manages all the Javascript functions relating to that view. Here’s a direct link to the views folder: https://github.com/ThePatShea/advanced-internal-university-social-network/tree/master/main/bubble_meteor/client/views 
















---

#### Disclaimer
I made most of my commits on this repo using another Github account called "campus-bubble". This was the account I used back when I was still working with my old company. If you'd like to verify this, please contact Campus Bubble's Chief of Product, Giovanni Hobbins: giovanni@campusbubble.com

---

#### Technologies Utilized
- Node.js stack including Express/MongoDB/Jade
- Several back-end node modules
- Several front-end Javascript libraries
- Fully responsive UI from desktop to mobile
- PhoneGap for iOS/Android apps
- Facebook API for user authentication
- Stripe API. At one point, I implemented a feature that allowed local businesses to pay for an account to post deals, but I decided to cut that feature from the final product.

---

#### Resources/Timeline
I built this product single-handedly in 7 months.

---

#### Directory Structure
```
-main/
 -app/
   |__controllers/
   |__models/
   |__views/
 -config/
   |__routes.js
   |__config.js
   |__passport.js (auth config)
```











Advanced Internal University Social Network

## Directory structure
```
-main/
  |__bubble_meteor/
      |__client/
        |__helpers/
        |__views/
      |__collections/
      |__server/
```
