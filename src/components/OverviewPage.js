import React from "react";
import _ from "lodash";
import ManageEvents from "./ManageEvents";
import ManageFriends from "./ManageFriends";
import { Route, Link } from "react-router-dom";

// handleClickAddEvent = () => {};

const OverviewPage = props => {
  // console.log(props);
  return props.userProfile !== null && props.userProfile !== undefined ? (
    <main className="overview-page">
      <h1>{_.capitalize(props.userProfile.user)}</h1>
      {/* Go through parties object and list all the parties and their recipes */}
      {props.userProfile.parties === undefined
        ? null
        : props.userProfile.parties.map(party => {
            return (
              <div>
                <h2>{party.title}</h2>
              </div>
            );
          })}

      <Link to="/manage-friends">Manage Friends</Link>
      <Link to="/manage-events">Manage Events</Link>

      <Route exact path="/manage-friends" component={ManageFriends} />
      <Route exact path="/manage-events" component={ManageEvents} />
    </main>
  ) : null;
};

export default OverviewPage;
