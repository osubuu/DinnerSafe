// Event page for a single event

import React, { Component } from "react";
import DisplayMatchingRecipes from "../DisplayMatchingRecipes/DisplayMatchingRecipes";
import { Link } from "react-router-dom";

class EventPage extends Component {
  render() {
    return (
      <div>
        <Link
          onClick={this.props.toggleOverviewList}
          className="go-to-overview"
          to="/Overview"
        >
          Back to Overview
        </Link>

        <h2>{this.props.selectedEvent.title}</h2>

        <div className="guestList">
          <ul className="guests">
            {this.props.userProfile.friends.map(friend => {
              if (
                friend.parties.indexOf(this.props.selectedEvent.title) !== -1
              ) {
                return (
                  <li className="guest">
                    {/* Edit the guests restrictions */}
                    <a href="#placeholderToEditGuestRestrictions">
                      <p>{friend.name}</p>

                      {/* Fake button to make it clear you can click on the guest to edit them */}
                      <div className="fakeButton">
                        <p>Edit</p>
                      </div>
                    </a>

                    {/* Removes guest from the event */}
                    <a href="#placeHolderToRemoveGuestFromEvenet">
                      Remove From Event
                    </a>
                  </li>
                );
              }
            })}
          </ul>
          <a href="#AddExistingGuest">Add Existing Guest</a>
          <a href="#AddNewGuest">Add New Guest</a>
        </div>

        <DisplayMatchingRecipes
          userProfile={this.props.userProfile}
          eventName={this.props.eventName}
        />
      </div>
    );
  }
}

export default EventPage;
