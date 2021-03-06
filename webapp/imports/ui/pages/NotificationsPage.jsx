import {List, ListItem} from 'material-ui/List';
import {blue600, gray600, green600, orange600, red600, yellow600} from 'material-ui/styles/colors';
import { GlassCard, Glass, DynamicSpacer, VerticalCanvas } from 'meteor/clinical:glass-ui';
import { CardHeader, CardText, CardTitle } from 'material-ui/Card';

import ActionInfo from 'material-ui/svg-icons/action/info';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import Archive from 'material-ui/svg-icons/content/archive';
import Avatar from 'material-ui/Avatar';
import Block from 'material-ui/svg-icons/content/block';
import Clear from 'material-ui/svg-icons/content/clear';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import ContentPaste from 'material-ui/svg-icons/content/content-paste';
import Divider from 'material-ui/Divider';
import Error from 'material-ui/svg-icons/alert/error';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import Flag from 'material-ui/svg-icons/content/flag';
import Mail from 'material-ui/svg-icons/content/mail';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import Report from 'material-ui/svg-icons/content/report';
import Subheader from 'material-ui/Subheader';
import Unarchive from 'material-ui/svg-icons/content/unarchive';
import Warning from 'material-ui/svg-icons/alert/warning';
import { Session } from 'meteor/session';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { get } from 'lodash';


Session.setDefault('currentPatientReference', {
  display: '',
  reference: ''
});

// import { SwipeEventExample } from '/imports/ui/components/SwipeEventExample';
import Swipeable from 'react-swipeable'

const sampleNotifications = [{
  primaryText:"Record copied",
  secondaryText:"Jan 20, 2014",                
  icon: 'ContentCopy',
  color: 'green600'
},
{
  primaryText:"Medication warning",
  secondaryText:"Jan 10, 2014",             
  icon: 'Warning',
  color: 'yellow600'
},
{
  primaryText:"New clinical note",
  secondaryText:"Jan 10, 2014",             
  icon: 'AddCircleOutline',
  color: 'green600'
},
{
  primaryText:"Archive export",
  secondaryText:"Jan 10, 2014",             
  icon: 'Archive',
  color: 'green600'
},
{
  primaryText:"Unencrypted email",
  secondaryText:"Jan 10, 2014",             
  icon: 'Mail',
  color: 'orange600'
},              
{
  primaryText:"Record copied",
  secondaryText:"Jan 10, 2014",             
  icon: 'ContentPaste',
  color: 'green600'
},              
{
  primaryText:"Record removed",
  secondaryText:"Jan 10, 2014",             
  icon: 'RemoveCircleOutline',
  color: 'green600'
},      
{
  primaryText: "Report!",
  secondaryText: "Jan 10, 2014",             
  icon: 'Report',
  color: 'red600'
},
{
  primaryText: "Report!",
  secondaryText: "Jan 10, 2014",             
  icon: 'Flag',
  color: 'orange600'
},
{
  primaryText: "Blocked!",
  secondaryText: "Jan 10, 2014",             
  icon: 'Block',
  color: 'red600'
},
{
  primaryText: "Unarchive",
  secondaryText: "Jan 10, 2014",             
  icon: 'Unarchive',
  color: 'green600'
}];



Session.setDefault('catchDialogOpen', false);

export class NotificationsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  getMeteorData() {
    let data = {
      style: {
        notification: Glass.darkroom({borderTop: '1px solid lightgray'}),
        title: Glass.darkroom()
      },
      catchDialog: {
        open: false,
        patient: {
          display: '',
          reference: ''
        }
      },
      notifications: []
      // notifications: sampleNotifications
    };


    if(Session.get('currentPatientReference')){
      data.catchDialog.patient = Session.get('currentPatientReference')
    }
    if(get(Meteor.user(), 'profile.incomingPatient')){
      data.catchDialog.patient = get(Meteor.user(), 'profile.incomingPatient');
      data.catchDialog.open = true;
    }
    if(get(Meteor.user(), 'profile.notifications')){
      data.notifications = get(Meteor.user(), 'profile.notifications');
    }

    return data;
  }


  onNotificationClick(message){
    console.log('lets try to remove this item...', message);
    Meteor.call('removeSpecificNotification', message)
  }
  handleCloseCatch(){
    Meteor.users.update({_id: Meteor.userId()}, {$unset: {
      'profile.incomingPatient': ''
    }});

  }  
  swiping(e, deltaX, deltaY, absX, absY, velocity) {
    //console.log("You're Swiping...", e, deltaX, deltaY, absX, absY, velocity)
    //alert("You're Swiping...", e, deltaX, deltaY, absX, absY, velocity)
  }
 
  swipingLeft(e, absX) {
    console.log("You're Swiping to the Left...", e, absX)
    //alert("You're Swiping to the Left...", e, absX)
  }
 
  swiped(e, deltaX, deltaY, isFlick, velocity) {
    //console.log("You Swiped...", e, deltaX, deltaY, isFlick, velocity)
  }
 
  swipedUp(e, deltaY, isFlick) {
    console.log("You Swiped Up...", e, deltaY, isFlick)
    Meteor.users.update({_id: Meteor.userId()}, {$set: {
      'profile.inbox': true,
      'profile.incomingPatient': {
        reference: Meteor.userId(),
        display: Meteor.user().fullName()
      }      
    }});
  }
  render() {
    var self = this;
    var notificationItems = [];
    this.data.notifications.forEach(function(notification, index){

      let newNotification = <ListItem
        key={index}
        leftAvatar={<Avatar icon={<Warning />} backgroundColor={yellow600} />}
        rightIcon={<Clear />}
        primaryText={notification.primaryText}
        secondaryText={notification.secondaryText}
        style={self.data.style.notification}Sidebar
        onClick={self.onNotificationClick.bind(this, notification.primaryText)}
      />;

      notificationItems.push(newNotification);
    });

    const catchActions = [
      <FlatButton
        label="Accept"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleCloseCatch}
      />,
      <FlatButton
        label="Dismiss"
        primary={true}
        onClick={this.handleCloseCatch}
      />
    ];

    console.log('notificationItems', notificationItems);

    var notificationPanel;
    if(this.data.notifications.length > 0){
      notificationPanel = <GlassCard height='auto'>
        <CardTitle title="Notifications" titleStyle={this.data.style.title} />
          <CardText>
            <List>
              {notificationItems}
            </List>
          </CardText>
        </GlassCard>  
    }

    return (
      <div id='notificationsPage' >
          <VerticalCanvas>
            <Swipeable
              onSwiping={this.swiping}
              onSwipingLeft={this.swipingLeft}
              onSwiped={this.swiped}
              onSwipedUp={this.swipedUp} 
            >
              { notificationPanel }

              <Dialog
                actions={catchActions}
                modal={false}
                open={this.data.catchDialog.open}
                onRequestClose={this.handleCloseCatch}
              >
                  <CardText>
                    <h2>{ get(this, 'data.catchDialog.patient.display') }</h2>
                    <h4 className='barcode'>{ get(this, 'data.catchDialog.patient.reference') }</h4>
                  </CardText>
              </Dialog>

          </Swipeable>
        </VerticalCanvas>
      </div>
    );
  }
}


ReactMixin(NotificationsPage.prototype, ReactMeteorData);
export default NotificationsPage;