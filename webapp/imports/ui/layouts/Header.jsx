import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionReorder from 'material-ui/svg-icons/action/reorder';
import AppBar from '/imports/ui/layouts/AppBar';

import { AuthenticatedNavigation } from '../components/AuthenticatedNavigation';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { Glass } from 'meteor/clinical:glass-ui';

// header
import { FlatButton, IconButton, TextField } from 'material-ui';
import { Meteor } from 'meteor/meteor';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { PublicNavigation } from '../components/PublicNavigation';
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Session } from 'meteor/session';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';

import { get } from 'lodash';

Sidebar = {
  lastUpdate: new Date(),
  toggle: function(){
    let currentUpdate = new Date();
    let timeDiff = currentUpdate - this.lastUpdate;
    if (timeDiff > 1000) {
      Session.toggle('drawerActive');
      console.log("timeDiff", timeDiff);
    }

    this.lastUpdate = currentUpdate;
  }
}

export class Header extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        searchbar: Glass.darkroom({
          position: 'fixed',
          top: '0px',
          width: '66%',
          opacity: Session.get('globalOpacity'),
          WebkitTransition: 'ease .2s',
          transition: 'ease .2s',
          borderWidth: '3px 0px 0px 2px',
          borderBottomRightRadius: '65px',
          transformOrigin: 'right bottom',
          paddingRight: '200px',
          height: '0px'
        }) ,
        searchbarInput: Glass.darkroom({
          left: '0px', 
          width: '80%',
          visibility: 'hidden'
        }),
        appbar: {
          position: 'fixed',
          top: '0px',
          width: '100%',
          opacity: Session.get('globalOpacity'),
          WebkitTransition: 'ease .2s',
          transition: 'ease .2s',
          background: 'white'
        },
        title: Glass.darkroom({
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          top: '-5px',
          cursor: 'pointer'
        })
      },
      app: {
        title: ''
      },
      isLogged: false
    };

    if(Session.get('showSearchbar')){
      data.style.searchbar.height = '64px';
      data.style.searchbar.display = 'flex';
      data.style.searchbarInput.visibility = 'visible';

    } else {
      data.style.searchbar.height = 0;      
      data.style.searchbar.display = 'none';
      data.style.searchbarInput.visibility = 'hidden';
    }
    if(Session.get('showNavbars')){
      data.style.searchbar.top = '65px';      
    } else {
      data.style.searchbar.top = '0px';
    }

    if (get(Meteor, 'settings.public.title')) {
      data.app.title = get(Meteor, 'settings.public.title');
    }

    if (Meteor.userId()) {
      data.isLoggedIn = true;
    }

    if (!Session.get('showNavbars')) {
      data.style.appbar.top = '-6.4em';
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);

    if (Meteor.user()) {
      data.hasUser = true;
    } else {
      data.hasUser = false;
    }

    return data;
  }
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  clickOnBackdropBlurButton(){
    Session.toggle('backgroundBlurEnabled');
  }

  toggleDrawerActive(){
    // this is hacky
    // taping on the Panel should autoclose the sidebar (we may even gray out the panel eventually)
    // and we set a small timeout on the toggleDrawerActive to let closeOpenedSidebar() do it's thing first
    Meteor.setTimeout(function(){
      //Sidebar.toggle();
      if (Session.equals('drawerActive', false)) {
        Session.set('drawerActive', true);
      }
    }, 200);
  }

  renderNavigation(hasUser) {
    if(get(Meteor, 'settings.public.home.showRegistration')){
      if (hasUser) {
        return <AuthenticatedNavigation />;
      } else {
        return <PublicNavigation />;
      }  
    }
  }

  goHome(){
    // not every wants the hexgrid menu, so we make sure it's configurable in the Meteor.settings file
    if(get(Meteor, 'settings.public.defaults.route')){
      browserHistory.push(get(Meteor, 'settings.public.defaults.route', '/'));
    } else {
      browserHistory.push('/');      
    }
  }

  render () {
    return(
      <div>
        <AppBar
          id="appHeader"
          title={this.data.app.title}
          onTitleTouchTap={this.goHome}
          iconStyleLeft={this.data.style.title}
          iconElementRight={ this.renderNavigation(this.data.hasUser) }
          style={this.data.style.appbar}
          titleStyle={this.data.style.title}
        >
          <ActionReorder 
            id='sidebarToggleButton'
            style={{marginTop: '20px', marginLeft: '25px', marginRight: '10px', left: '0px', position: 'absolute', cursor: 'pointer'}}
            onClick={this.toggleDrawerActive}
            />
        </AppBar>

        <AppBar
          id="appSearchBar"
          title={<div>
              <TextField
              hintText="Search"
              style={this.data.style.searchbarInput}
              fullWidth
            />
          </div>}
          style={this.data.style.searchbar}
          showMenuIconButton={false}
        >
          
        </AppBar>      
      </div>
    );
  }
}
Header.childContextTypes = {
  muiTheme: PropTypes.object
};

ReactMixin(Header.prototype, ReactMeteorData);
export default Header;
